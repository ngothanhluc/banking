import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";

const TotalBalanceBox = ({
    accounts = [],
    totalBanks,
    totalCurrentBalance,
}: TotalBalanceBoxProps) => {
    return (
        <section className="total-balance">
            <div className="total-balance-chart">
                <DoughnutChart accounts={accounts} />
            </div>
            <div className="flex flex-col gap-6">
                <div className="header-2">{totalBanks} Bank Accounts</div>
                <div className="flex flex-col gap-2">
                    <p className="total-balance-label">Total Current Balance</p>
                    <div className="total-balance-amount">
                        <AnimatedCounter amount={totalCurrentBalance} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TotalBalanceBox;
