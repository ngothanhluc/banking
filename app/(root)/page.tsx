import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import { getLoggedInUser } from '@/lib/actions/user.action'

const Home = async () => {
    const loggedIn = await getLoggedInUser()
    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        user={loggedIn?.name || 'Guest'}
                        subtext="Access & manage your account and transactions efficiently."
                    ></HeaderBox>
                    <TotalBalanceBox
                        accounts={[]}
                        totalBanks={2}
                        totalCurrentBalance={999}
                    />
                </header>
                RECENT TRANSACTIONS
            </div>
            <RightSidebar user={loggedIn} transactions={[]} banks={[{}, {}]} />
        </section>
    )
}

export default Home
