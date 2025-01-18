import Loader from "@/components/ui/Loader"

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="flex flex-col items-center justify-center">
                <Loader />
            </div>
        </div>
    )
}