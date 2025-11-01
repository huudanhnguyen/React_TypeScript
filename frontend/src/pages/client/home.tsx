import React from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Checkbox,
  InputNumber,
  Button,
  Rate,
  Menu,
  Typography,
  Pagination,
  Drawer,
} from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import {
  FilterOutlined
} from "@ant-design/icons";
import "../../styles/home.scss";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const categories = ["A", "B", "C", "D", "E", "F"];
const options = categories.map((c) => ({ label: c, value: c }));

const allProducts = Array.from({ length: 36 }).map((_, index) => ({
  id: index + 1,
  name: "The Money Thinking - Smarter and Wiser Financial Choices",
  price: 70000,
  sold: "Sold 1k",
  rating: 5,
  image:
    "https://cdn0.fahasa.com/media/catalog/product/t/u/tu_duy_ve_tien_bac_bia_1_2019_09_10_16_11_41.jpg",
}));

const PAGE_SIZE = 8;

const HomePage: React.FC = () => {
  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [minPrice, setMinPrice] = React.useState<number | null>(null);
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const products = allProducts.slice(start, end);

  // Tách riêng phần lọc để tái sử dụng cho cả Sidebar và Drawer
  const renderFilters = (
    <>
      <Title level={5}>Search Filters</Title>

      <div className="filter-section">
        <Text>Categories</Text>
        <Checkbox.Group
          options={options}
          value={checkedList}
          onChange={setCheckedList}
        />
      </div>

      <div className="filter-section">
        <Text>Price Range</Text>
        <div className="price-inputs">
          <InputNumber
            placeholder="From"
            value={minPrice ?? undefined}
            onChange={setMinPrice}
            min={0}
          />
          <span>-</span>
          <InputNumber
            placeholder="To"
            value={maxPrice ?? undefined}
            onChange={setMaxPrice}
            min={0}
          />
        </div>
        <Button type="primary" block>
          Apply
        </Button>
      </div>

      <div className="filter-section">
        <Text>Rating</Text>
        {[5, 4, 3, 2].map((stars) => (
          <div key={stars}>
            <Rate disabled defaultValue={stars} />
            <Text> and up</Text>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <Layout>
      <Layout>
        {/* Sidebar for desktop */}
        <Sider width={250} className="sider sider-desktop">
          {renderFilters}
        </Sider>

        {/* Drawer for mobile */}
        <Drawer
          title="Search Filters"
          placement="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          width={250}
        >
          {renderFilters}
        </Drawer>

        <Content className="content">
          {/* Filter button only visible on mobile */}
          <div className="mobile-filter-btn">
            <Button
              icon={<FilterOutlined />}
              onClick={() => setOpenDrawer(true)}
            >
              Bộ lọc
            </Button>
          </div>

          <Menu mode="horizontal" selectable={false} className="menu-sort">
            <Menu.Item>Popular</Menu.Item>
            <Menu.Item>Newest</Menu.Item>
            <Menu.Item>Price: Low to High</Menu.Item>
            <Menu.Item>Price: High to Low</Menu.Item>
          </Menu>

          <Row gutter={[16, 16]}>
            {products.map((p) => (
              <Col xs={12} sm={8} md={6} lg={6} xl={4} key={p.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={p.name}
                      src={p.image}
                      style={{ height: 250, objectFit: "cover" }}
                    />
                  }
                >
                  <Text className="product-name">{p.name}</Text>
                  <div className="product-info">
                    <Text strong>{p.price.toLocaleString()} ₫</Text>
                    <Rate disabled defaultValue={p.rating} />
                    <div>{p.sold}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={allProducts.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
