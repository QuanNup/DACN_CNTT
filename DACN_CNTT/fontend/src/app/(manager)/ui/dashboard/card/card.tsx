import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "./card.module.css";

const Card = ({ item }: any) => {
    return (
        <div
            className='p-5 rounded-lg flex gap-5 cursor-pointer w-full bg-gradient-to-br from-white to-gray-300 dark:from-[#182237] dark:to-[#253352] 
                       hover:shadow-lg hover:bg-gradient-to-tr hover:from-white hover:to-gray-400 
                       dark:hover:from-[#253352] dark:hover:to-[#2e374a]'
        >
            <MdSupervisedUserCircle size={24} />
            <div className='flex flex-col gap-5'>
                <span className='font-medium text-2xl mb-5'>{item.title}</span>
                <span className='font-medium text-2xl'>{item.number}</span>
                <span className='text-sm font-light'>
                    <span className={item.change > 0 ? 'text-lime-500' : 'text-red-500'}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                    </span>{" "}
                    {item.change > 0 ? "nhiều hơn" : "ít hơn"} so với tuần trước
                </span>
            </div>
        </div>
    );
};

export default Card;
