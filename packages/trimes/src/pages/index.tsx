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
        <div className=" px-5 py-10 lg:px-48 lg:flex lg:space-x-12 pt-8 shadow-2xl m-10 rounded-xl text-center">
          <div className="lg:w-1/4">
            <h2 className="text-3xl font-semibold italic text-orange-500">
              अपनो से अपनो की बात
            </h2>
            <span>{editorial.createdAt.toLocaleString()}</span>
          </div>
          <div className="w-full mt-4">
            <h3 className="text-2xl font-semibold text-orange-600">{editorial.title}</h3>
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

      <div className="w-full grid md:grid-cols-4 gap-4 px-10 mt-10 ">
        <div className="bg-[#f94301] px-2 rounded-lg text-center shadow-2xl">
          <div className="text-xl lg:text-2xl text-white mt-2">TrimesShikshaMission.org</div>
          <div className="mt-4 text-white py-4">
            Trimes Shiksha Mission is a small initiative in the direction of
            realizing a very materializing and comprehensive thinking. The
            mission is to provide a platform for the youth of the country to get
            the right direction in their lives.
          </div>
        </div>
        <div className="px-2 text-center mt-3 shadow-2xl py-4">
          <div className="text-xl text-orange-500">Matrimonial</div>
          <div className="mt-10">
            Helping Trivedi Meware Brahamins to cherish the meaning of Happy
            Marriage and help them to find their better half.
          </div>
        </div>
        <div className="text-center shadow-2xl py-4 mt-3">
          <div className="text-xl text-orange-500 ">Find/Post Jobs</div>
          <div className="mt-10 px-2">
            We Help community members to Find or Post Jobs.
          </div>
        </div>
        <div className="text-center mt-3 shadow-2xl py-4">
          <div className="text-xl text-orange-500">News</div>
          <div className="mt-10 px-3">
            We help community members to get updated with the latest events and
            achievements etc. of the community.
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
