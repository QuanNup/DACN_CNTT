export default function PaymentSuccess({
    searchParams: { amount },
}: {
    searchParams: { amount: number };
}) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };
    return (
        <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold mb-2">Cảm ơn!</h1>
                <h2 className="text-2xl">Bạn đã thanh toán thành công</h2>

                <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
                    {(amount)}
                </div>
            </div>
        </main>
    );
}