import Image from 'next/image'
import { FC } from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { IoLocationSharp } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import { FaHeart } from 'react-icons/fa'
import Link from 'next/link'

export const Footer: FC = () => {
  return (
    <div className="mt-10">
      <div className="w-full p-8 grid md:grid-cols-3 gap-4 md:px-28 bg-primary text-white bg-[#3d4045]">
        <div>
          <h5 className="text-base">CONTACT</h5>
          <div className="mt-3 text-[0.8rem]">
            <p>
              Trimes Shiksha Mission is a non-profit organization registered as
              a NGO
            </p>
            <span className="mt-4 block">
              <IoLocationSharp className="inline mr-1" />
              Address of Trimes Shiksha Mission
            </span>
            <a href="tel:+91-9413217950" className="mt-4 block">
              <BsFillTelephoneFill className="inline mr-1" />
              +91- 9413217950
            </a>
            <a
              href="mailto:trimesshikshamission@gmail.com"
              className="mt-4 block"
            >
              <MdEmail className="inline mr-1" />
              trimesshikshamission@gmail.com
            </a>
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
                <Link href="/news">NEWS</Link>
              </li>
              <hr />
              <li>
                <Link href="/gyanganga">GYAN GANGA</Link>
              </li>
              <hr />
              <li>
                <Link href="/students">STUDENTS</Link>
              </li>
              <hr />
              <li>
                <Link href="/matrimonial">MATRIMONIAL</Link>
              </li>
              <hr />
              <li>
                <Link href="/jobs">JOB PORTAL</Link>
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
            <ul className="flex flex-col text-[0.8rem] space-y-1">
              <li>
                <Link href="/privacy">PRIVACY POLICY</Link>
              </li>
              <hr />
              <li>
                <Link href="/terms">TERMS OF USE</Link>
              </li>
              <hr />
              <li>
                <Link href="/faq">FAQS</Link>
              </li>
              <hr />
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-secondary w-full px-8 py-1 text-base flex flex-col sm:flex-row justify-between text-white bg-[#808080]">
        <span>Copyright &copy; 2022 Trimes Shiksha Mission</span>
        <span>Terms of Use | Privacy Policy</span>
      </div>
    </div>
  )
}
