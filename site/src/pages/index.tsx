import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Layout } from '~/components/Layout'
import { api } from '~/utils/api'

const Home: NextPage = () => {
  //? States
  const [editorialPage, setEditorialPage] = useState(1)

  const { data: editorial, isLoading: getEditorialLoading } =
    api.editorial.get.useQuery({
      page: editorialPage
    })
  const { data: banners, isLoading: getBannersLoading } =
    api.banners.getAll.useQuery()

  return (
    <Layout loading={getEditorialLoading || getBannersLoading}>
      {editorial && (
        <div className="text-center px-3 py-10 lg:px-48 pt-8 shadow-xl m-10 rounded-xl shadow-blue-500/50 border-4 border-black">
          <div className="">
            <h2 className="text-3xl font-semibold italic text-red-400">
              अपनों से अपनी बात (Editorial)
            </h2>
            <div className="text-xs  mt-4 font-semibold italic text-blue-500">
              &quot;हो सकता है मैं आपके विचारों से सहमत न हो पाऊं फिर भी विचार
              प्रकट करने के आपके अधिकारों की रक्षा करूंगा...&quot;
            </div>
            <h2 className="text-xs font-semibold italic text-purple-500 text-right px-3">
              ~वाल्तेयर
            </h2>
          </div>
          <div className="w-full mt-8">
            <div className="text-2xl font-semibold text-orange-600">
              {editorial.editorial?.title}
            </div>
            <div
              className="mt-2 "
              dangerouslySetInnerHTML={{
                __html: editorial.editorial?.body || ''
              }}
            />
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-10">
            {editorialPage !== 1 && (
              <button
                className="bg-primary text-white px-3 py-2 rounded-lg"
                onClick={() => {
                  scrollTo(0, 0)
                  setEditorialPage(prev => prev - 1)
                }}
                disabled={editorialPage === 1}
              >
                Previous
              </button>
            )}
            {editorialPage !== editorial.count && (
              <button
                className="bg-primary text-white px-3 py-2 rounded-lg ml-4"
                onClick={() => {
                  scrollTo(0, 0)
                  setEditorialPage(prev => prev + 1)
                }}
                disabled={editorialPage === editorial.count}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 sm:p-24">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{
            dynamicBullets: true
          }}
          autoplay
        >
          {banners?.map(banner => (
            <SwiperSlide key={banner.id}>
              <div className="relative h-[50dvh]">
                <Image
                  src={banner.url}
                  alt="trimes-photo"
                  fill
                  className="object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="grid md:grid-cols-4 gap-4 px-10 mt-10 ">
        <div className="bg-primary px-2 rounded-lg text-center shadow-2xl">
          <div className="text-xl lg:text-2xl text-white mt-2">
            TrimesShikshaMission.org
          </div>
          <div className="mt-4 text-white py-4">
            Trimes Shiksha Mission is a small initiative in the direction of
            realizing a very materializing and comprehensive thinking. The
            mission is to provide a platform for the youth of the country to get
            the right direction in their lives.
          </div>
        </div>
        <div className="px-2 text-center mt-3 shadow-xl shadow-blue-500/50 py-4 border-4 border-black">
          <div className="text-xl text-orange-400">Social Activities</div>
          <div className="mt-10 flex flex-col gap-2">
            <Link
              className="p-2 bg-primary text-white rounded-lg"
              href="/social-activities/institutions"
            >
              पंजीकृत संस्थाओं से
            </Link>
            <Link
              className="p-2 bg-primary text-white rounded-lg"
              href="/social-activities/areas"
            >
              चौखलों/इकाइयों से
            </Link>
          </div>
        </div>
        <Link
          href="/employment-news"
          className="text-center shadow-xl shadow-blue-500/50 py-4 mt-3 border-4 border-black"
        >
          <div className="text-xl text-orange-400 ">Employment News</div>
          <div className="mt-10 px-2">
            We Help community members to Find or Post Jobs.
          </div>
        </Link>
        <Link
          href="/advertisements"
          className="text-center mt-3 shadow-xl shadow-blue-500/50 py-4 border-4 border-black"
        >
          <div className="text-xl text-orange-400">Advertisements</div>
          <div className="mt-10 px-3">
            View or Contact us to post your Advertisements.
          </div>
        </Link>
      </div>
    </Layout>
  )
}

export default Home
