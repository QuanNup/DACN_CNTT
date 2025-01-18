import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./typeorm/entities/product.entities";
import { In, Repository } from "typeorm";
import aqp from "api-query-params";
import { ProductImage } from "./typeorm/entities/product-image.entities";
import { Discount } from "./typeorm/entities/discount.entities";
import { CreateProductDto } from "./dto/create-product.dto";
import * as dayjs from "dayjs";
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { ProductImageDto } from "./dto/create-image.dto";
import { Category } from "src/categories/typeorm/entities/category.entities";
import { KafkaProducerService } from "src/products/kafka-producer.service";
import { BatchProductDetails } from "./dto/batch-product-detail.dto";
import { join } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";

dayjs.extend(utc)
dayjs.extend(timezone)
@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>,
        @InjectRepository(Discount)
        private readonly discountRepository: Repository<Discount>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly kafkaProducerService: KafkaProducerService
    ) { }

    // checkStoreExists = async (store_id: string)=> {
    //     try {
    //         const response = await this.httpService.get(`http://store-service/stores/${store_id}`).toPromise();
    //     } catch (error) {
    //         throw new BadRequestException('Cửa hàng không tồn tại');
    //     }
    // }

    async createProduct(createProductDto: CreateProductDto, files: Express.Multer.File[]) {
        const { images, category_id, discounts, ...productData } = createProductDto;

        const category = await this.categoryRepository.findOne({ where: { category_id: category_id } });
        if (!category) {
            throw new Error('Thể loại không tồn tại !');
        }
        // Lưu thông tin sản phẩm
        const product = await this.productRepository.create({
            ...productData,
            category,
            created_at: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'),
        });
        const savedProduct = await this.productRepository.save(product);

        const uploadedUrls = files.length > 0 ? await this.handleFileUpload(files, savedProduct) : [];
        const allImages = this.processImages(images, uploadedUrls);

        // Lưu hình ảnh
        if (allImages.length > 0) {
            const imageEntities = allImages.map((image) =>
                this.productImageRepository.create({
                    url: image.url,
                    product: savedProduct,
                }),
            );
            await this.productImageRepository.save(imageEntities);
        }

        // Xử lý giảm giá
        if (Array.isArray(discounts) && discounts.length > 0) {
            const productDiscounts = discounts.map((discount) =>
                this.discountRepository.create({
                    ...discount,
                    product: savedProduct,
                }),
            );
            await this.discountRepository.save(productDiscounts);
        }
        return savedProduct;
    }

    async updateProduct(
        productId: string,
        updateProductDto: Partial<CreateProductDto>,
        files: Express.Multer.File[],
    ) {
        const { images, category_id, discounts, ...productData } = updateProductDto;

        // Kiểm tra sản phẩm có tồn tại không
        const existingProduct = await this.productRepository.findOne({
            where: { product_id: productId },
            relations: ['category', 'images', 'discounts'],
        });
        if (!existingProduct) {
            throw new Error('Sản phẩm không tồn tại!');
        }

        // Cập nhật danh mục (category)
        if (category_id) {
            const category = await this.categoryRepository.findOne({ where: { category_id } });
            if (!category) {
                throw new Error('Thể loại không tồn tại!');
            }
            existingProduct.category = category;
        }

        // Cập nhật dữ liệu sản phẩm
        Object.assign(existingProduct, {
            ...productData,
            updated_at: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'),
        });

        // Lưu sản phẩm
        const updatedProduct = await this.productRepository.save(existingProduct);

        // Xử lý hình ảnh
        if ((images && images.length > 0) || (files && files.length > 0)) {

            // Lấy danh sách URL từ file upload
            const uploadedUrls = files.length > 0 ? await this.handleFileUpload(files, updatedProduct) : [];

            // Kết hợp hình ảnh từ client và URL đã upload
            const allImages = this.processImages(images, uploadedUrls);

            // Xóa các hình ảnh cũ liên quan đến sản phẩm (nếu cần)
            await this.productImageRepository.delete({ product: updatedProduct });

            // Lưu hình ảnh mới
            const imageEntities = allImages.map((image) =>
                this.productImageRepository.create({
                    url: image.url,
                    product: updatedProduct,
                }),
            );
            await this.productImageRepository.save(imageEntities);
        }

        // Xử lý giảm giá (discounts)
        if (Array.isArray(discounts)) {
            // Xóa các giảm giá cũ
            await this.discountRepository.delete({ product: updatedProduct });

            // Lưu giảm giá mới
            const productDiscounts = discounts.map((discount) =>
                this.discountRepository.create({
                    ...discount,
                    product: updatedProduct,
                }),
            );
            await this.discountRepository.save(productDiscounts);
        }

        await this.kafkaProducerService.sendProductUpdate(productId, {
            ...productData,
            category_id: category_id || existingProduct.category.category_id,
            images,
            discounts,
        });

        return updatedProduct;
    }

    private processImages(
        images: ProductImageDto[] | undefined,
        uploadedUrls: string[],
    ): ProductImageDto[] {
        const allImages: ProductImageDto[] = [];

        // Hình ảnh từ file upload
        if (uploadedUrls && uploadedUrls.length > 0) {
            const uploadedFiles = uploadedUrls.map((url) => ({ url }));
            allImages.push(...uploadedFiles);
        }

        // Hình ảnh từ URL client
        if (images && images.length > 0) {
            const urlImages = images.map((image) => ({ url: image.url }));
            allImages.push(...urlImages);
        }

        return allImages;
    }

    private async handleFileUpload(files: Express.Multer.File[], product: any): Promise<string[]> {
        // Sanitize tên sản phẩm
        const productName = product.product_name || 'product';
        const sanitizedProductName = productName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();

        // Đường dẫn thư mục lưu trữ
        const uploadPath = join(process.cwd(), 'uploads', `${sanitizedProductName}-${product.product_id}`);

        // Tạo thư mục nếu chưa tồn tại
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
        }

        const fileUrls: string[] = [];
        for (const file of files) {
            try {
                // Tạo tên file duy nhất
                const fileExtension = file.originalname.split('.').pop();
                const uniqueSuffix = Date.now();
                const finalFileName = `${sanitizedProductName}-${uniqueSuffix}.${fileExtension}`;
                const filePath = join(uploadPath, finalFileName);

                // Ghi file vào hệ thống
                writeFileSync(filePath, file.buffer);

                // Tạo URL cho file
                const fileUrl = `http://localhost:8080/api/v1/products/uploads/${sanitizedProductName}-${product.product_id}/${finalFileName}`;
                fileUrls.push(fileUrl);
            } catch (error) {
                console.error(`Error saving file ${file.originalname}:`, error);
                throw new Error('Không thể lưu file, vui lòng thử lại.');
            }
        }

        return fileUrls;
    }



    async findOne(product_id: string) {
        return await this.productRepository.findOne({
            where: { product_id },
            relations: ['images', 'discounts', 'category']
        })
    }

    async findAll(query: string, current: number, pageSize: number) {
        // Parse query với aqp để hỗ trợ lọc và sắp xếp
        const { filter, sort } = aqp(query);

        // Loại bỏ các tham số phân trang không cần thiết
        if (filter.current) delete filter.current;
        if (filter.pageSize) delete filter.pageSize;

        // Xác thực tham số phân trang
        current = current > 0 ? current : 1; // Nếu `current` <= 0, mặc định là 1
        pageSize = pageSize > 0 ? pageSize : 10; // Nếu `pageSize` <= 0, mặc định là 10

        // Truy vấn cơ sở dữ liệu
        const [results, totalItems] = await this.productRepository.findAndCount({
            where: filter, // Bộ lọc
            skip: (current - 1) * pageSize, // Số bản ghi cần bỏ qua
            take: pageSize, // Số bản ghi cần lấy
            order: sort, // Sắp xếp
            relations: ['images']
        });

        // Tính tổng số trang
        const totalPages = Math.ceil(totalItems / pageSize);

        // Trả về dữ liệu
        return {
            results, // Danh sách sản phẩm
            totalPages, // Tổng số trang
            current, // Trang hiện tại
            totalItems, // Tổng số sản phẩm
            pageSize, // Số lượng sản phẩm mỗi trang
        };
    }


    async hotProduct() {
        try {
            // Truy vấn để lấy 10 sản phẩm có lượt bán cao nhất
            return await this.productRepository.find({
                order: {
                    purchase_count: 'DESC', // Sắp xếp giảm dần theo purchase_count
                },
                take: 10, // Giới hạn 10 sản phẩm
            });
        } catch (error) {
            console.error('Error fetching hot products:', error);
            throw new Error('Cannot fetch hot products at the moment.');
        }
    }

    async getBatchProductDetails(batchProductDetails: BatchProductDetails) {
        if (!batchProductDetails.productVariants || batchProductDetails.productVariants.length === 0) {
            throw new Error('productVariants is missing or empty');
        }

        // Danh sách tất cả product_id
        const productIds = batchProductDetails.productVariants.map(v => v.product_id);
        // Tạo Map để quản lý các `variant` theo `product_id`
        const variantsMap = batchProductDetails.productVariants.reduce((map, v) => {
            if (!map.has(v.product_id)) {
                map.set(v.product_id, []);
            }
            map.get(v.product_id).push(v.variant);
            return map;
        }, new Map<string, string[]>());

        // Lấy danh sách sản phẩm từ database
        const products = await this.productRepository.find({
            where: { product_id: In(productIds) },
            relations: ['images', 'discounts', 'category'],
        });

        // Lọc các hình ảnh theo `variant` tương ứng
        // const filteredProducts = products.flatMap(product => {
        //     const variants = variantsMap.get(product.product_id);

        //     if (!variants || variants.length === 0) {
        //         return [{
        //             ...product,
        //             images: null, // Không có hình ảnh tương ứng
        //         }];
        //     }

        //     // Tạo các sản phẩm riêng biệt cho mỗi `variant`
        //     return variants.map(variant => ({
        //         ...product,
        //         images: product.images.filter(image => image.variants === variant) || null,
        //     }));
        // });
        return products;
    }
}