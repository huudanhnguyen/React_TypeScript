import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBookAPI, getBookCategoryAPI } from "@/services/api";
import {
  Layout,
  Row,
  Col,
  Card,
  Checkbox,
  Button,
  Rate,
  Menu,
  Typography,
  Pagination,
  Drawer,
  Spin,
  Empty,
  Slider,
  notification, // ✅ used for displaying error notifications
} from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { FilterOutlined } from "@ant-design/icons";
import "../../styles/home.scss";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

// --- Default constants ---
const DEFAULT_PAGE_SIZE = 6;
const DEFAULT_MIN_PRICE = 50000;
const DEFAULT_MAX_PRICE = 500000;

// =========================================================
// 🏠 COMPONENT: HomePage
// =========================================================
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // =========================================================
  // 🧩 States for filter, pagination, and UI control
  // =========================================================
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [tempCheckedList, setTempCheckedList] = useState<CheckboxValueType[]>([]);
  const [minPrice, setMinPrice] = useState<number>(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState<number>(DEFAULT_MAX_PRICE);
  const [tempPrice, setTempPrice] = useState<[number, number]>([
    DEFAULT_MIN_PRICE,
    DEFAULT_MAX_PRICE,
  ]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [openDrawer, setOpenDrawer] = useState(false);

  // =========================================================
  // 📚 States for data: books and categories
  // =========================================================
  const [listCategory, setListCategory] = useState<{ label: string; value: string }[]>([]);
  const [listBook, setListBook] = useState<IBookTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [sortType, setSortType] = useState<string>("-createdAt");

  // =========================================================
  // 🧠 Fetch all book categories (runs once on mount)
  // =========================================================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getBookCategoryAPI();
        if (res?.data) {
          const categories = res.data.map((item: string) => ({
            label: item,
            value: item,
          }));
          setListCategory(categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        notification.error({
          message: "Failed to Load Categories",
          description: "Unable to fetch book categories. Please try again later.",
        });
      }
    };
    fetchCategory();
  }, []);

  // =========================================================
  // ⚙️ Fetch books with filters, sorting, and pagination
  // =========================================================
  const fetchBooks = async (
    page = 1,
    size = pageSize,
    filters?: {
      categories?: CheckboxValueType[];
      min?: number;
      max?: number;
    }
  ) => {
    setLoading(true);
    try {
      // Build query string dynamically
      let query = `current=${page}&pageSize=${size}&sort=${sortType}`;
      const categoryList = filters?.categories ?? checkedList;
      const min = filters?.min ?? minPrice;
      const max = filters?.max ?? maxPrice;

      if (categoryList.length > 0) query += `&category=${encodeURIComponent(categoryList.join(","))}`;
      if (min >= 0) query += `&price>=${min}`;
      if (max >= 0) query += `&price<=${max}`;

      // Call API to fetch books
      const res = await getBookAPI(query);

      if (res?.data?.result) {
        setListBook(res.data.result);
        if (res.data.meta) setMeta(res.data.meta);
      } else {
        setListBook([]);
        notification.warning({
          message: "No Books Found",
          description: "No books match your current filters.",
        });
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      notification.error({
        message: "Failed to Load Books",
        description: "Unable to fetch the book list. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 🪄 Auto-fetch when pagination or sort changes
  // ✅ Removed direct fetch from Pagination to avoid double-fetch
  // =========================================================
  useEffect(() => {
    fetchBooks(currentPage, pageSize);
  }, [currentPage, sortType, pageSize]);

  // =========================================================
  // 🔄 Reset filters to default values
  // =========================================================
  const handleResetFilters = async () => {
    setCheckedList([]);
    setTempCheckedList([]);
    setMinPrice(DEFAULT_MIN_PRICE);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setTempPrice([DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]);
    setCurrentPage(1);

    await fetchBooks(1, pageSize, {
      categories: [],
      min: DEFAULT_MIN_PRICE,
      max: DEFAULT_MAX_PRICE,
    });
  };

  // =========================================================
  // ✅ Apply temporary filters and refresh book list
  // =========================================================
  const handleApplyFilters = async () => {
    setCheckedList(tempCheckedList);
    setMinPrice(tempPrice[0]);
    setMaxPrice(tempPrice[1]);
    setCurrentPage(1);

    await fetchBooks(1, pageSize, {
      categories: tempCheckedList,
      min: tempPrice[0],
      max: tempPrice[1],
    });
  };

  // =========================================================
  // 🧰 Render the filter section (shared by Sider and Drawer)
  // =========================================================
  const renderFilters = (
    <>
      <Title level={5}>Search Filters</Title>

      {/* --- Category Filter --- */}
      <div className="filter-section">
        <Text strong style={{ fontSize: "15px", display: "block", marginBottom: 8 }}>
          Categories
        </Text>
        <Checkbox.Group
          options={listCategory}
          value={tempCheckedList}
          onChange={(v) => setTempCheckedList(v)}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        />
      </div>

      {/* --- Price Filter --- */}
      <div className="filter-section">
        <Text strong style={{ fontSize: "15px", display: "block", marginBottom: 8 }}>
          Price Range
        </Text>

        <Slider
          range
          min={0}
          max={500000}
          step={10000}
          tooltip={{
            formatter: (value) =>
              value?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }),
          }}
          value={tempPrice}
          onChange={(value) => setTempPrice(value as [number, number])}
        />

        {/* Display selected price range */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text>{tempPrice[0].toLocaleString("vi-VN")} ₫</Text>
          <Text>{tempPrice[1].toLocaleString("vi-VN")} ₫</Text>
        </div>

        {/* Buttons for reset/apply */}
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <Button block onClick={handleResetFilters}>
            Reset
          </Button>
          <Button block type="primary" onClick={handleApplyFilters}>
            Apply
          </Button>
        </div>
      </div>
    </>
  );

  // =========================================================
  // 🖼️ Main Page Render
  // =========================================================
  return (
    <Layout>
      <Layout>
        {/* --- Sidebar filters (desktop) --- */}
        <Sider width={250} className="sider sider-desktop">
          {renderFilters}
        </Sider>

        {/* --- Drawer filters (mobile) --- */}
        <Drawer
          title="Search Filters"
          placement="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          width={250}
        >
          {renderFilters}
        </Drawer>

        {/* --- Main content --- */}
        <Content className="content">
          {/* Mobile Filter Button */}
          <div className="mobile-filter-btn">
            <Button icon={<FilterOutlined />} onClick={() => setOpenDrawer(true)}>
              Filter
            </Button>
          </div>

          {/* Sorting Menu */}
          <Menu
            mode="horizontal"
            selectedKeys={[sortType]}
            className="menu-sort"
            onClick={(e) => {
              setSortType(e.key);
              setCurrentPage(1);
            }}
          >
            <Menu.Item key="-sold">Popular</Menu.Item>
            <Menu.Item key="-createdAt">Newest</Menu.Item>
            <Menu.Item key="price">Price: Low to High</Menu.Item>
            <Menu.Item key="-price">Price: High to Low</Menu.Item>
          </Menu>

          {/* --- Book List --- */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Spin size="large" />
            </div>
          ) : listBook.length === 0 ? (
            <Empty description="No books found" />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {listBook.map((book) => {
                  const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
                  const imageUrl = book.thumbnail
                    ? `${baseUrl}/images/book/${book.thumbnail}`
                    : "https://via.placeholder.com/200x250";

                  return (
                    <Col xs={12} sm={8} md={6} lg={6} xl={4} key={book._id}>
                      <Card
                        hoverable
                        onClick={() => navigate(`/book/${book._id}`)}
                        cover={
                          <img
                            alt={book.mainText}
                            src={imageUrl}
                            style={{ height: 250, objectFit: "cover" }}
                            loading="lazy" // ✅ lazy-load for better performance
                          />
                        }
                      >
                        <Text className="product-name">{book.mainText}</Text>
                        <div className="product-info">
                          <Text strong>{book.price?.toLocaleString()} ₫</Text>
                          <Rate disabled defaultValue={5} />
                          <div>Sold {book.sold ?? 0}</div>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              {/* --- Pagination --- */}
              <div className="pagination-container">
                <Pagination
                  current={meta.current}
                  pageSize={pageSize}
                  total={meta.total}
                  showSizeChanger
                  pageSizeOptions={["6", "12", "24"]}
                  onChange={(page, size) => {
                    // ✅ Only update state here, fetch will run automatically via useEffect
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                  showTotal={(total) => `Total ${total} books`}
                />
              </div>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
