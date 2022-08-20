import { Blog } from '@prisma/client'
import { NextPage } from 'next'
import { prismaClient } from '../lib/prisma'

export const getServerSideProps = async () => {
  const news = await prismaClient.blog.findMany({ where: { type: 'NEWS' } })

  if (!news.length) {
    return {
      props: {}
    }
  }
  return {
    props: {
      news: news.map(n => ({
        ...n,
        createdAt: new Date(n.createdAt).toLocaleString()
      }))
    }
  }
}

const Matrimonial: NextPage<{ news: Blog }> = ({ news }) => {
  return <>{JSON.stringify(news)}</>
}
export default Matrimonial
