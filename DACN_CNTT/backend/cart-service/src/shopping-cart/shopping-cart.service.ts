import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as dayjs from "dayjs";
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { ShoppingCart } from "./typeorm/entities/shopping-cart.entities";
import { In, Repository } from "typeorm";
import { ShoppingCartItem } from "./typeorm/entities/shopping-cart-iteams.entities";
import { CreateShoppingCartDto } from "./dto/create-shopping-cart.dto";
import { UpdateShoppingCartDto } from "./dto/update-shopping-cart.dto";

dayjs.extend(utc);
dayjs.extend(timezone);
@Injectable()
export class ShoppingCartService {
    constructor(
        @InjectRepository(ShoppingCart)
        private readonly shoppingCartRepository: Repository<ShoppingCart>,
        @InjectRepository(ShoppingCartItem)
        private readonly shoppingCartIteamRepository: Repository<ShoppingCartItem>,

    ) { }

    async getAllByUserId(user_id: string) {
        if (!user_id) {
            throw new BadRequestException('Unauthorize')
        }

        const shoppingCarts = await this.shoppingCartRepository.find({
            where: { user_id },
            relations: ['items'],
        });
        // Sắp xếp các items theo variant
        shoppingCarts.forEach(cart => {
            cart.items.sort((a, b) => {
                const variantA = a.variant?.toLowerCase() || ''; // Chuyển đổi sang chữ thường để so sánh
                const variantB = b.variant?.toLowerCase() || '';
                return variantA.localeCompare(variantB); // So sánh theo thứ tự chữ cái
            });
        });

        return shoppingCarts;
    }

    async createShoppingcart(createShoppingCartDto: CreateShoppingCartDto) {
        const { items, user_id } = createShoppingCartDto

        // Lấy giỏ hàng hiện tại của người dùng
        const existingCart = await this.shoppingCartRepository.findOne({
            where: { user_id },
            relations: ['items'], // Lấy cả items
        });

        let totalPrice = 0;

        // Nếu đã có giỏ hàng, kiểm tra sản phẩm trùng lặp
        if (existingCart) {
            const existingItems = existingCart.items;

            // Cập nhật hoặc thêm mới item vào giỏ hàng
            items.forEach((newItem) => {
                const existingItem = existingItems.find(
                    (item) =>
                        item.product_id === newItem.product_id &&
                        item.variant === newItem.variant
                );

                if (existingItem) {
                    // Nếu trùng `product_id`, cập nhật số lượng và giá
                    existingItem.quantity += newItem.quantity;
                    existingItem.price = newItem.price;
                } else {
                    // Nếu không trùng, thêm sản phẩm mới vào giỏ hàng
                    const cartItem = new ShoppingCartItem();
                    cartItem.product_id = newItem.product_id;
                    cartItem.variant = newItem.variant;
                    cartItem.quantity = newItem.quantity;
                    cartItem.price = newItem.price;
                    existingItems.push(cartItem);
                }
            });

            // Tính lại tổng giá
            totalPrice = existingItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            // Cập nhật giỏ hàng
            existingCart.items = existingItems;
            existingCart.totalPrice = totalPrice;
            existingCart.updatedAt = new Date(dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'));

            return await this.shoppingCartRepository.save(existingCart);
        }

        // Nếu chưa có giỏ hàng, tạo mới
        const cartItems = items.map((item) => {
            const cartItem = new ShoppingCartItem();
            cartItem.product_id = item.product_id;
            cartItem.variant = item.variant;
            cartItem.quantity = item.quantity;
            cartItem.price = item.price;
            return cartItem;
        });

        totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const shoppingCart = new ShoppingCart();
        shoppingCart.user_id = user_id;
        shoppingCart.items = cartItems;
        shoppingCart.totalPrice = totalPrice;
        shoppingCart.createdAt = new Date(dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'));
        shoppingCart.updatedAt = new Date(dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'));

        return await this.shoppingCartRepository.save(shoppingCart);
    }

    async updateShoppingcart(updateShoppingCartDto: UpdateShoppingCartDto) {
        const { items, user_id } = updateShoppingCartDto;
        // Kiểm tra giỏ hàng tồn tại
        const existingCart = await this.shoppingCartRepository.findOne({
            where: { user_id },
            relations: ['items'],
        });

        if (!existingCart) {
            throw new Error('Giỏ hàng không tồn tại!');
        }

        // Kiểm tra người dùng (nếu cần)
        if (user_id && user_id !== existingCart.user_id) {
            throw new Error('Người dùng không hợp lệ!');
        }
        // Lưu trữ các ID item đã xóa
        //const itemsToDelete: string[] = [];

        let totalPrice = 0;
        const existingItems = existingCart.items;
        const itemsToDelete = [];
        // Cập nhật hoặc xóa item trong giỏ hàng
        // Cập nhật hoặc thêm mới item trong giỏ hàng
        for (const updatedItem of items) {

            // Tìm item dựa trên item_id nếu có
            const existingItemIndex = existingCart.items.findIndex(item => item.id === updatedItem.id);

            if (existingItemIndex !== -1) {
                // Nếu tìm thấy item trong giỏ hàng, kiểm tra variant
                const existingItem = existingCart.items[existingItemIndex];

                if (existingItem.variant !== updatedItem.variant) {
                    // Nếu variant đã thay đổi, tìm sản phẩm có cùng product_id và variant mới
                    const existingVariantIndex = existingCart.items.findIndex(item =>
                        item.product_id === updatedItem.product_id && item.variant === updatedItem.variant
                    );

                    if (existingVariantIndex !== -1) {
                        // Nếu tìm thấy sản phẩm với product_id và variant đã tồn tại
                        const existingVariantItem = existingCart.items[existingVariantIndex];
                        existingVariantItem.quantity += updatedItem.quantity; // Gộp số lượng
                        // Xóa item cũ
                        itemsToDelete.push(existingItem.id);

                    } else {
                        // Nếu variant mới chưa tồn tại trong giỏ hàng, cập nhật item cũ
                        existingItem.quantity = updatedItem.quantity; // Cập nhật quantity
                        existingItem.price = updatedItem.price; // Cập nhật price
                        existingItem.variant = updatedItem.variant; // Cập nhật variant
                    }
                } else {
                    // Nếu variant không thay đổi, cập nhật quantity và price
                    existingItem.quantity = updatedItem.quantity; // Cập nhật quantity
                    existingItem.price = updatedItem.price; // Cập nhật price
                }
            } else {
                // Nếu không tìm thấy item theo ID, tìm theo product_id và variant
                const existingVariantIndex = existingCart.items.findIndex(item =>
                    item.product_id === updatedItem.product_id && item.variant === updatedItem.variant
                );

                if (existingVariantIndex !== -1) {
                    // Nếu sản phẩm với cùng product_id và variant đã tồn tại trong giỏ hàng
                    const existingVariantItem = existingCart.items[existingVariantIndex];
                    existingVariantItem.quantity += updatedItem.quantity; // Gộp số lượng
                    existingVariantItem.price = updatedItem.price; // Cập nhật price
                } else {
                    // Nếu không có sản phẩm nào trùng khớp, thêm sản phẩm mới vào giỏ hàng
                    if (updatedItem.quantity > 0) {
                        const newItem = new ShoppingCartItem();
                        newItem.product_id = updatedItem.product_id;
                        newItem.variant = updatedItem.variant;
                        newItem.quantity = updatedItem.quantity;
                        newItem.price = updatedItem.price;
                        newItem.shoppingCart = existingCart; // Gán giỏ hàng cho sản phẩm mới

                        existingCart.items.push(newItem);
                    }
                }
            }
        };

        if (itemsToDelete.length > 0) {
            const deleteItems = await this.shoppingCartIteamRepository.find({
                where: { id: In(itemsToDelete), shoppingCart: { id: existingCart.id } },
                relations: ['shoppingCart'],
            });
            await this.shoppingCartIteamRepository.remove(deleteItems);
            existingCart.items = existingCart.items.filter(item => !itemsToDelete.includes(item.id));
        }
        // Tính lại tổng giá
        totalPrice = existingItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // Cập nhật giỏ hàng
        //existingCart.items = existingItems;
        existingCart.totalPrice = totalPrice;
        existingCart.updatedAt = new Date(dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'));
        return await this.shoppingCartRepository.save(existingCart);
    }

    async updateCartItems(productId: string, updatedData: any) {

        // Lấy tất cả các mục trong giỏ hàng có chứa sản phẩm này
        const cartItems = await this.shoppingCartIteamRepository.find({
            where: { product_id: productId },
            relations: ['shoppingCart'], // Liên kết với giỏ hàng
        });

        // Cập nhật từng mục giỏ hàng
        for (const item of cartItems) {
            item.price = updatedData.price || item.price; // Cập nhật giá
            item.quantity = item.quantity; // Giữ nguyên số lượng
            await this.shoppingCartIteamRepository.save(item); // Lưu thay đổi của item

            // Lấy giỏ hàng liên quan để tính lại tổng giá trị
            const cart = await this.shoppingCartRepository.findOne({
                where: { id: item.shoppingCart.id },
                relations: ['items'], // Lấy tất cả các item trong giỏ hàng
            });

            if (cart) {
                // Tính tổng giá trị giỏ hàng
                cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                cart.updatedAt = new Date();

                // Lưu giỏ hàng đã cập nhật
                await this.shoppingCartRepository.save(cart);
            }
        }

    }
    async deleteCartItem(user_id: string, item_id: string[]) {
        // Kiểm tra user_id
        if (!user_id) {
            throw new UnauthorizedException('Unauthorized user');
        }
        if (!item_id) {
            throw new BadRequestException('Không tồn tại sản phẩm trong giỏ hàng');
        }

        // Tìm giỏ hàng của người dùng
        const existingCart = await this.shoppingCartRepository.findOne({
            where: { user_id },
            relations: ['items'],
        });

        if (!existingCart) {
            throw new NotFoundException('Shopping cart not found');
        }

        // Tìm item trong giỏ hàng
        const existingItem = await this.shoppingCartIteamRepository.find({
            where: { id: In(item_id), shoppingCart: { id: existingCart.id } },
        });

        if (!existingItem) {
            throw new NotFoundException('Shopping cart item not found');
        }

        // Xóa item
        await this.shoppingCartIteamRepository.remove(existingItem);
        return {
            message: `Item with id ${item_id} has been deleted.`
        }
    }
}