import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './typeorm/entities/payment.entities';
import { PaymentMethod } from './typeorm/entities/payment-method.entities';
import { Transaction } from './typeorm/entities/payment-transaction.entities';
import { CreatePaymentMethodDto } from './dto/payment-method.dto';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { CreateTransactionDto } from './dto/payment-transaction.dto';


@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(PaymentMethod)
        private paymentMethodRepository: Repository<PaymentMethod>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) { }

    async handleOrderCreated(payload: any) {
        try {
            const { orderId, totalAmount, user_id, currency, methodType, details } = payload;
            // 1. Tìm hoặc tạo phương thức thanh toán (PaymentMethod)
            let paymentMethod = await this.paymentMethodRepository.findOne({
                where: { methodType },
            });

            if (!paymentMethod) {
                // Tạo PaymentMethod mà không có mảng payments
                const createPaymentMethodDto: CreatePaymentMethodDto = {
                    methodType,
                    details: details || {}, // Nếu không có thông tin chi tiết, mặc định là chuỗi rỗng
                };

                // Tạo entity PaymentMethod
                paymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);
                // Lưu PaymentMethod vào cơ sở dữ liệu
                await this.paymentMethodRepository.save(paymentMethod);
            }

            // 2. Tạo PaymentDto
            const createPaymentDto: CreatePaymentDto = {
                userId: user_id,
                orderId,
                methodId: paymentMethod.id, // Liên kết với PaymentMethod đã tạo
                amount: totalAmount,
                currency: currency || 'VND', // Mặc định là VND nếu không có giá trị
                status: 'PENDING', // Trạng thái mặc định là PENDING
                transactions: [
                    {
                        paymentId: '', // Placeholder, sẽ được cập nhật sau khi lưu Payment
                        details: { description: 'Tạo thanh toán' }, // Chi tiết giao dịch
                        status: 'PENDING', // Trạng thái ban đầu là PENDING
                    },
                ],
            };

            // Tạo và lưu Payment entity
            const payment = this.paymentRepository.create(createPaymentDto);
            const savedPayment = await this.paymentRepository.save(payment);

            // 3. Cập nhật paymentId trong giao dịch
            const transactionDto: CreateTransactionDto = {
                paymentId: savedPayment.id, // Cập nhật paymentId thực tế sau khi lưu Payment
                details: { orderId, userId: user_id, totalAmount, currency }, // Chi tiết giao dịch dưới dạng object
                status: 'PENDING', // Trạng thái ban đầu là PENDING
            };

            // Tạo và lưu Transaction entity
            const transaction = this.transactionRepository.create(transactionDto);
            await this.transactionRepository.save(transaction);

            console.log(`Payment và giao dịch ban đầu đã được tạo cho đơn hàng ${orderId} với trạng thái PENDING`);
        } catch (error) {
            console.error('Lỗi khi xử lý đơn hàng mới:', error);
            throw new Error('Error processing the order');
        }
    }

    async handleOrderUpdated(payload: any) {
        try {

            const { orderId, totalAmount, userId, currency, methodType, details, status } = payload;

            // 1. Tìm phương thức thanh toán (PaymentMethod)
            let paymentMethod = await this.paymentMethodRepository.findOne({
                where: { methodType },
            });

            if (!paymentMethod) {
                // Nếu không tìm thấy phương thức thanh toán, tạo mới PaymentMethod
                const createPaymentMethodDto: CreatePaymentMethodDto = {
                    methodType,
                    details: details || {}, // Nếu không có thông tin chi tiết, mặc định là chuỗi rỗng
                };

                // Tạo và lưu PaymentMethod
                paymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);
                await this.paymentMethodRepository.save(paymentMethod);
            }

            // 2. Cập nhật Payment (hoặc tạo mới nếu không tìm thấy)
            let payment = await this.paymentRepository.findOne({
                where: { orderId },
            });

            if (!payment) {
                // Nếu không tìm thấy payment, tạo mới PaymentDto
                const createPaymentDto: CreatePaymentDto = {
                    userId,
                    orderId,
                    methodId: paymentMethod.id, // Liên kết với PaymentMethod đã tạo hoặc tìm thấy
                    amount: totalAmount,
                    currency: currency || 'VND', // Mặc định là VND nếu không có giá trị
                    status: status, // Trạng thái mặc định là PENDING
                    transactions: [
                        {
                            paymentId: '', // Placeholder, sẽ được cập nhật sau khi lưu Payment
                            details: { description: 'Cập nhật thanh toán' }, // Chi tiết giao dịch
                            status: status, // Trạng thái ban đầu là PENDING
                        },
                    ],
                };

                // Tạo và lưu Payment entity
                payment = this.paymentRepository.create(createPaymentDto);
                await this.paymentRepository.save(payment);
            } else {
                // Nếu đã có payment, cập nhật thông tin
                payment.method = paymentMethod; // Cập nhật phương thức thanh toán
                payment.amount = totalAmount;
                payment.currency = currency || 'VND';
                payment.status = status; // Trạng thái có thể thay đổi tùy theo yêu cầu

                await this.paymentRepository.save(payment);
            }

            // 3. Cập nhật hoặc tạo TransactionDto
            let transaction = await this.transactionRepository.findOne({
                where: { payment: { id: payment.id } },  // Hoặc { payment: { id: payment.id } } nếu dùng quan hệ
            });

            if (!transaction) {
                // Nếu không tìm thấy giao dịch, tạo mới TransactionDto
                const transactionDto: CreateTransactionDto = {
                    paymentId: payment.id,
                    details: { orderId, userId, totalAmount, currency },
                    status: status, // Trạng thái ban đầu là PENDING
                };

                // Tạo và lưu Transaction entity
                transaction = this.transactionRepository.create(transactionDto);
                await this.transactionRepository.save(transaction);
            } else {
                // Nếu đã có giao dịch, cập nhật thông tin
                transaction.details = { orderId, userId, totalAmount, currency };
                transaction.status = status; // Trạng thái có thể thay đổi tùy theo yêu cầu

                await this.transactionRepository.save(transaction);
            }

            console.log(`Payment và giao dịch đã được cập nhật cho đơn hàng ${orderId} với trạng thái PENDING`);
        } catch (error) {
            console.error('Lỗi khi xử lý đơn hàng cập nhật:', error);
            throw new Error('Error updating the order');
        }
    }
}
