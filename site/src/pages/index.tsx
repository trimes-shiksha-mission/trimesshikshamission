import type { NextPage } from 'next'
import Image from 'next/image'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Layout } from '~/components/Layout'
import { api } from '~/utils/api'

const Home: NextPage = () => {
  const { data: editorial, isLoading: getEditorialLoading } =
    api.editorial.get.useQuery()

  return (
    <Layout loading={getEditorialLoading}>
      {editorial && (
        <div className=" px-3 py-10 lg:px-48 lg:flex lg:space-x-12 pt-8 shadow-xl m-10 rounded-xl text-center shadow-blue-500/50 border-4 border-black">
          <div className="lg:w-1/4">
            <h2 className="text-3xl font-semibold italic text-red-400 text-center">
              अपनों से अपनी बात (Editorial)
            </h2>
            <div className="text-1xs  mt-4 font-semibold italic text-blue-500 text-center">
              &quot;हो सकता है मैं आपके विचारों से सहमत न हो पाऊं फिर भी विचार
              प्रकट करने के आपके अधिकारों की रक्षा करूंगा...&quot;
            </div>
            <h2 className="text-1xs font-semibold italic text-purple-500 text-right px-3">
              ~वाल्तेयर
            </h2>
          </div>
          <div className="w-full mt-4 text-center">
            <div className="text-2xl font-semibold text-orange-600 text-center">
              {editorial.title}
            </div>
            <div
              className="mt-2 "
              dangerouslySetInnerHTML={{
                __html: editorial.body
              }}
            ></div>
          </div>
        </div>
      )}

      <div className="mt-10 p-24">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{
            dynamicBullets: true
          }}
          autoplay
        >
          {[...Array(9)].map((_, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-[50dvh]">
                <Image
                  src={`/trimes-photos/${index + 1}.jpeg`}
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
        <div className="bg-[#FDAE09] px-2 rounded-lg text-center shadow-2xl">
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
          <div className="text-xl text-orange-400">Matrimonial</div>
          <div className="mt-10">
            Helping Trivedi Meware Brahamins to cherish the meaning of Happy
            Marriage and help them to find their better half.
          </div>
        </div>
        <div className="text-center shadow-xl shadow-blue-500/50 py-4 mt-3 border-4 border-black">
          <div className="text-xl text-orange-400 ">Find/Post Jobs</div>
          <div className="mt-10 px-2">
            We Help community members to Find or Post Jobs.
          </div>
        </div>
        <div className="text-center mt-3 shadow-xl shadow-blue-500/50 py-4 border-4 border-black">
          <div className="text-xl text-orange-400">News</div>
          <div className="mt-10 px-3">
            We help community members to get updated with the latest events and
            achievements etc. of the community.
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
