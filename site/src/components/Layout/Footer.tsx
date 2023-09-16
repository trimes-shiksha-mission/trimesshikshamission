import Link from 'next/link'
import { FC } from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa'
import { IoLocationSharp } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'

export const Footer: FC = () => {
  return (
    <div className="mt-10 bottom-0">
      <div className="p-8 grid md:grid-cols-3 gap-3 md:px-28 bg-[#3d4045] text-white">
        <div>
          <h5 className="text-base">CONTACT</h5>
          <div className="mt-3 text-[0.8rem]">
            <p>
              त्रिमेस शिक्षा मिशन कोई आर्गेनाइजेशन नहीं है। यह तो मात्र एक
              अभियान है। जो 3-E ( E ducation, E mployment & E nvironment) पर
              कार्य करने को उद्धृत है। इस मिशन के अन्तर्गत 18-07-2021 को Trimes
              Vidhya Pracharini Sansthan (त्रिमेस विद्या प्रचारिणी संस्थान TVS)
              नाम से संस्था की स्थापना की गई जो एक Non Profit NGO है।
            </p>
            <span className="mt-4 block">
              <IoLocationSharp className="inline mr-1" />
              अस्थाई कार्यालय&nbsp;:- 104-F Sector 9A Udaipur, Rajasthan
            </span>
            <Link href="tel:+91-9413217950" className="mt-4 block">
              <BsFillTelephoneFill className="inline mr-1" />
              +91- 9413217950
            </Link>
            <Link
              href="mailto:trimesshikshamission@gmail.com"
              className="mt-4 block"
            >
              <MdEmail className="inline mr-1" />
              trimesshikshamission@gmail.com
            </Link>
          </div>
        </div>
        <div>
          <h5 className="text-base">QUICK LINKS</h5>
          <div className="mt-3">
            <ul className="flex flex-col text-[0.8rem] space-y-1">
              <li>
                <Link href="/">HOME</Link>
              </li>
              <hr />
              <li>
                <Link href="/employment-news">EMPLOYMENT NEWS</Link>
              </li>
              <hr />
              <li>
                <Link href="/tsm/gyan-ganga">GYAN GANGA</Link>
              </li>
              <hr />
            </ul>
          </div>
        </div>
        <div>
          <h5 className="text-base">TRIMES SKHIKSHA MISSION</h5>
          <div className="mt-3  text-[0.8rem] ">
            <div className="text-2xl mb-2 text-center text-white">
              <FaHeart className="inline mr-1 text-red-500" /> MADE IN INDIA
            </div>
            <hr />
          </div>
        </div>
      </div>
      <div className="bg-secondary px-8 py-1 text-base flex flex-col sm:flex-row justify-between text-white bg-[#808080]">
        <span>
          Copyright &copy; {new Date().getFullYear()} TRIMES SHIKSHA MISSION.
          ALL RIGHTS RESERVED
        </span>
      </div>
    </div>
  )
}
