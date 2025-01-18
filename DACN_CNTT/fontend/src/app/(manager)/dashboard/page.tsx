import { cards } from "../lib/data";
import Card from "../ui/dashboard/card/card";
import Chart from "../ui/dashboard/chart/chart";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import SideBar from "../ui/dashboard/sidebar/sidebar";
import Transactions from "../ui/dashboard/transaction/transaction";


const Dashboard: React.FC = () => {
  return (
    <div className="flex gap-5 my-8 ml-5"
      style={{
        maxHeight: '100%', overflowY: 'auto', scrollbarWidth: 'none',
      }}
    >
      <div className="flex flex-col gap-5" style={{ flex: 3 }}>
        <div className="flex gap-5 justify-between">
          {cards.map((item) => (
            <Card item={item} key={item.id} />
          ))}
        </div>
        <div className="mb-8">
          <Transactions />
        </div>
        <div className="mb-8">
          <Chart />
        </div>
      </div>
      <div className="flex-1">
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
