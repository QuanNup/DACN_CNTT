import { Body, Controller, Get, Inject, Param, Post, Put, Query, Req, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./products.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./dto/create-product.dto";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./typeorm/entities/product.entities";
import { Repository } from "typeorm";
import { Category } from "src/categories/typeorm/entities/category.entities";
import { BatchProductDetails } from "./dto/batch-product-detail.dto";
@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        @Inject('PRODUCT_SERVICE') private readonly kafkaClient: ClientKafka,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async onModuleInit() {
        this.kafkaClient.connect();
    }

    @Post('create-product')
    @UseInterceptors(FilesInterceptor('images')) // 'images' là key trong form-data
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        // Chuyển dữ liệu và file upload tới service

        const createdProduct = await this.productService.createProduct(createProductDto, files);

        // await this.kafkaClient.emit('product-created', createProductDto)
        return createdProduct
    }

    @Put('update-product/:product_id')
    @UseInterceptors(FilesInterceptor('images')) // 'images' là key trong form-data
    async updateProduct(
        @Param('product_id') product_id: string,
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        // Chuyển dữ liệu và file upload tới service
        return await this.productService.updateProduct(product_id, createProductDto, files);
    }

    @Get('product-detail/:id')
    getProductById(@Param('id') id: string) {
        return this.productService.findOne(id)
    }

    @Get('get-all-products')
    findAll(
        @Query() query: string,
        @Query("current") current: string,
        @Query("pageSize") pageSize: string,
    ) {
        return this.productService.findAll(query, +current, +pageSize)
    }

    @Get('get-hot-products')
    getHotProduct() {
        return this.productService.hotProduct()
    }

    @MessagePattern('product-search') // Lắng nghe topic 'search-products'
    async handleProductSearch(@Payload() data: any) {

        const { query } = data;

        // Tìm kiếm trong cơ sở dữ liệu
        const results = await this.productRepository
            .createQueryBuilder('product')
            .where('product.product_name ILIKE :query OR product.product_description ILIKE :query', {
                query: `%${query}%`,
            })
            .getMany();

        return results; // Trả về dữ liệu qua Kafka
    }

    @MessagePattern('category-search') // Lắng nghe topic 'search-products'
    async handleCategorySearch(@Payload() data: any) {
        const { query } = data;

        // Tìm kiếm trong cơ sở dữ liệu
        const results = await this.categoryRepository
            .createQueryBuilder('category')
            .where('category.category_name ILIKE :query OR category.category_description ILIKE :query', {
                query: `%${query}%`,
            })
            .getMany();

        return results; // Trả về dữ liệu qua Kafka
    }

    @MessagePattern('category-suggestion')
    async handleCategorySuggestion(@Payload() data: any) {
        const { query } = data;

        // Tìm kiếm từ khóa trong name và description
        const suggestions = await this.categoryRepository
            .createQueryBuilder('category')
            .select(['category.category_id', 'category.category_name'])
            .where('category.category_name ILIKE :query OR category.category_description ILIKE :query', {
                query: `%${query}%`,
            })
            //.limit(5) // Giới hạn số lượng kết quả
            .getMany();

        return suggestions;
    }

    @MessagePattern('product-suggestion')
    async handleProductSuggestion(@Payload() data: any) {
        const { query } = data;

        // Tìm kiếm từ khóa trong name và description
        const suggestions = await this.productRepository
            .createQueryBuilder('product')
            .select(['product.product_id', 'product.product_name'])
            .where('product.product_name ILIKE :query OR product.product_description ILIKE :query', {
                query: `%${query}%`,
            })
            //.limit(5) // Giới hạn số lượng kết quả
            .getMany();

        return suggestions;
    }

    @Post('batch-details')
    async getBatchProductDetails(
        @Body() batchProductDetails: BatchProductDetails
    ) {
        return await this.productService.getBatchProductDetails(batchProductDetails);
    }
}