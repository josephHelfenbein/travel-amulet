import QuizForm from 'src/components/quiz-form'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home : NextPage = () => {
    return (
        <div>
            <Head>
                <title>Quiz</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.png" />
            </Head>
            <main className="">
                <div className="d-flex mt-5 justify-content-center">
                    <QuizForm />
                </div>
            </main>
        </div>
    )
}
export default Home