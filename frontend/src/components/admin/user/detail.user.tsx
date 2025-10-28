import { Badge, Descriptions, Drawer, Avatar, Divider, Empty } from "antd";
import dayjs from "dayjs";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IUserTable | null;
  setDataViewDetail: (v: IUserTable | null) => void;
}

const DetailUser = (props: IProps) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;
  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };
  const avatarUrl = dataViewDetail?.avatar
    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
        dataViewDetail.avatar
      }`
    : null;
  return (
    <>
      <Drawer
        title="👤 User Details"
        width={420}
        onClose={onClose}
        open={openViewDetail}
        styles={{
          body: { backgroundColor: "#fafafa", paddingBottom: "24px" },
        }}
      >
        {dataViewDetail ? (
          <div className="flex flex-col items-center text-center">
            <Avatar
              size={120}
              src={avatarUrl}
              icon={!avatarUrl && <UserOutlined />}
              style={{
                backgroundColor: !avatarUrl ? "#1677ff" : "transparent",
                marginBottom: 16,
                border: "1px solid #ddd",
              }}
            />

            <h2 className="text-lg font-semibold mb-1">
              {dataViewDetail.fullName || "No name"}
            </h2>
            <p className="text-gray-500 mb-4">ID: {dataViewDetail._id}</p>

            <Divider />

            <Descriptions
              column={1}
              bordered
              size="small"
              labelStyle={{ fontWeight: "600", width: "120px" }}
              contentStyle={{ background: "#fff" }}
            >
              <Descriptions.Item
                label={
                  <>
                    <MailOutlined /> Email
                  </>
                }
              >
                {dataViewDetail.email || "Not available"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <PhoneOutlined /> Phone
                  </>
                }
              >
                {dataViewDetail.phone || "Not available"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <FieldTimeOutlined /> Created At
                  </>
                }
              >
                {dataViewDetail.createdAt
                  ? dayjs(dataViewDetail.createdAt).format(
                      "DD/MM/YYYY HH:mm:ss"
                    )
                  : "Not available"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <UserOutlined /> Role
                  </>
                }
              >
                {dataViewDetail.role}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          <Empty
            description={<span>No user data available</span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Drawer>
    </>
  );
};
export default DetailUser;
