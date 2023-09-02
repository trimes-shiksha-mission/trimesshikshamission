import { DeleteOutlined } from "@ant-design/icons";
import { Button, Image, Table } from "antd";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { Layout } from "~/components/Layout";
import { useMessageApi } from "~/context/messageApi";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx)
  return {
    redirect: !session
      ? {
        destination: '/auth'
      }
      : session.user.role !== 'SUPERUSER'
        ? {
          destination: '/'
        }
        : undefined,
    props: {}
  }
}

const HomeBanner: NextPage = () => {
  const messageApi = useMessageApi()
  const [file, setFile] = useState<File | null>(null)


  const { data: banners, isLoading: getBannersLoading, refetch } = api.banners.getAll.useQuery()
  const { mutateAsync: deleteResource, isLoading: deleteResourceLoading } = api.resources.deleteOne.useMutation()


  return <Layout title="Banner Images" breadcrumbs={[{ label: 'Banner Images' }]}  >
    <input type="file" onChange={(e) => {
      const f = e.currentTarget.files?.[0]
      if (f)
        setFile(f)
    }} />
    <Button
      disabled={banners && banners?.length >= 10}
      className="my-4"
      onClick={
        async () => {
          if (!file) return messageApi.error('Please select a file')
          const formData = new FormData()
          formData.append('file', file)
          formData.append('type', 'banner')
          await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          await refetch()

          return messageApi.success('Banner image created')
        }}
    >Save</Button>

    <Table
      loading={getBannersLoading}
      columns={[
        {
          title: 'Sr. No.',
          render: (_, __, index) => index + 1
        },
        {
          title: 'Name',
          dataIndex: 'name'
        },
        {
          title: 'Image',
          render: (_, record) => <Image src={record.url} alt="" width={40} height={40} />
        },
        {
          title: 'Actions',
          render: (_, record) => <Button
            loading={deleteResourceLoading}
            icon={<DeleteOutlined />}
            type="text"
            size="small"
            danger
            onClick={async () => {
              await deleteResource(record.id)
              await refetch()
              messageApi.success('Banner image deleted')
            }
            }

          />
        }
      ]}
      dataSource={banners}
    />
  </Layout >
}

export default HomeBanner