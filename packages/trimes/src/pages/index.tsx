import { Editorial } from '@prisma/client'
import type { NextPage } from 'next'
import Image from 'next/image'
import { Autoplay, Pagination } from 'swiper'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { prismaClient } from '../lib/prisma'

export const getServerSideProps = async () => {
  const editorial = await prismaClient.editorial.findFirst({
    orderBy: { createdAt: 'desc' }
  })

  console.log(editorial)
  if (!editorial)
    return {
      props: {}
    }
  return {
    props: {
      editorial: {
        title: editorial?.title,
        body: editorial?.body,
        createdAt: new Date(editorial?.createdAt).toLocaleString()
      }
    }
  }
}

const Home: NextPage<{ editorial: Editorial }> = ({ editorial }) => {
  return (
    <>
      {editorial && (
        <div className=" px-20 py-10 lg:px-48 lg:flex lg:space-x-12 pt-8 shadow-2xl m-10 rounded-xl">
          <div className="lg:w-1/4">
            <h2 className="text-3xl font-semibold italic">मन की बात</h2>
            <span>{editorial.createdAt.toLocaleString()}</span>
          </div>
          <div className="w-full">
            <h3 className="text-2xl font-semibold">{editorial.title}</h3>
            <p
              className="mt-2"
              dangerouslySetInnerHTML={{
                __html: editorial.body.replaceAll('\n', '<br/>')
              }}
            ></p>
          </div>
        </div>
      )}

      <Swiper
        className="mt-10"
        modules={[Pagination, Autoplay]}
        pagination={{
          dynamicBullets: true
        }}
        autoplay={{
          delay: 2000
        }}
      >
        {[...Array(10)].map((_, index) => (
          <SwiperSlide key={index}>
            <Image
              src={`/trimes-photos/${index + 1}.jpeg`}
              alt="trimes-photo"
              layout="responsive"
              width={1280}
              height={720}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default Home
