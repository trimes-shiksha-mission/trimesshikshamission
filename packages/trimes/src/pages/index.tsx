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
        <div className="px-48 flex space-x-12">
          <div>
            <h2 className="text-3xl font-semibold italic">मन की बात</h2>
            <span>{editorial.createdAt.toLocaleString()}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{editorial.title}</h3>
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
        className="mt-20"
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
