import Layout from '@/layouts/Layout'
import Head from 'next/head'
import React from 'react'

const app = () => {
  return (
    <Layout>
      <>
				<Head>
					<title>Inventory</title>
					<meta name='description' content='Generated by create next app' />
					<meta name='viewport' content='width=device-width, initial-scale=1' />
					<link rel='icon' href='/favicon.ico' />
				</Head>
				<div className='flex-col w-full h-full p-10 lg:flex'>
					<div className='flex justify-between'>
						<div>filtros</div>
						<div>acciones</div>
					</div>
					<div className='debug h-full w-full'>tabla</div>
					<div>paginacion</div>
				</div>
			</>
    </Layout>
  )
}

export default app