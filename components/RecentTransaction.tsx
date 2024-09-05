import Link from 'next/link'
import BankInfo from './BankInfo'
import { BankTabItem } from './BankTabItem'
import { Pagination } from './Pagination'
import TransactionTable from './TransactionTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const RecentTransaction = ({
    accounts,
    appwriteItemId,
    page = 1,
    transactions = [],
}: RecentTransactionsProps) => {
    const rowPerPage = 10
    const totalPages = Math.ceil(transactions.length / rowPerPage)
    const indexOfLastTransaction = page * rowPerPage
    const indexOfFirstTransaction = indexOfLastTransaction - rowPerPage
    const currentTransactions = transactions.slice(
        indexOfFirstTransaction,
        indexOfLastTransaction
    )
    return (
        <section className="recent-transactions">
            <header className="flex items-center justify-between">
                <h2 className="recent-transactions-label">
                    Recent Transactions
                </h2>
                <Link
                    href={`/transaction-history/?id={${appwriteItemId}`}
                    className="view-all-btn"
                >
                    View all
                </Link>
            </header>
            <Tabs defaultValue={appwriteItemId} className="w-full">
                <TabsList className="recent-transactions-tablist">
                    {accounts.map((account) => (
                        <TabsTrigger
                            key={account.id}
                            value={account.appwriteItemId}
                        >
                            <BankTabItem
                                key={account.id}
                                account={account}
                                appwriteItemId={appwriteItemId}
                            />
                        </TabsTrigger>
                    ))}
                </TabsList>
                {accounts.map((account) => (
                    <TabsContent
                        key={account.id}
                        value={account.appwriteItemId}
                        className="space-y-4"
                    >
                        <BankInfo
                            account={account}
                            appwriteItemId={appwriteItemId}
                            type="full"
                        />
                        <TransactionTable transactions={currentTransactions} />
                        {totalPages > 1 && (
                            <div className="my-4 w-full">
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                />
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    )
}

export default RecentTransaction
