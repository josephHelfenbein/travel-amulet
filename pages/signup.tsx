import SignUpForm from 'components/signup-form'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home : NextPage = () => {
    return (
        <div>
            <Head>
                <title>Sign Up</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.png" />
            </Head>
            <main className="">
                <div className="d-flex mt-5 justify-content-center">
                    <SignUpForm />
                </div>
            </main>
        </div>
    )
}
export default Home