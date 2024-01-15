import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import Col from "../../bootstrap/Col";
import Container from "../../bootstrap/Container";
import Layout from "../../bootstrap/Layout";
import Row from "../../bootstrap/Row";
import Spinner from "../../bootstrap/Spinner";
import languageData from "../../lib/lang.config.json";

import {
  BlogPageHeaderWrapper,
  BlogPageSubTitle,
  BlogPageTitle,
  BlogWrapper,
  InnerBlogCard,
  PaginationWrapper,
  SingleCard,
  SpinnerWrapper,
} from "./AllBlog.styles";

const AllBlog = () => {
  const { webSettingData } = useSelector((state) => state.busLists);
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const blogsPerPage = 6;
  const pageVisited = pageNumber * blogsPerPage;
  const [displayUsers, setDisplayUsers] =  useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [notFound, setNotFound] = useState(true);
  const [message, setMessage] = useState('');
  const [userProfileInfo, setUserProfileInfo] = useState(null);

  
  useEffect(() => {
    setUserProfileInfo(JSON.parse(localStorage.getItem("userProfileInfo")));
  }, []);
  

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_DOMAIN}/blogs`)
      .then((res) => res.json())
      .then((data) => {


        console.log('data', data);

        if(data.status == "success"){
          setNotFound(false)
          setBlogData(data.data);
          const bgData = data.data.slice(pageVisited, pageVisited + blogsPerPage);
          const pgCount = Math.ceil(data.data.length / blogsPerPage);
          setDisplayUsers(bgData);
          setPageCount(pgCount);
          setLoading(false);
        }else{
          setNotFound(true);
          setMessage(data.message);
          setLoading(false);
        }


      });
  }, []);



  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <Layout title="blog" userProfileInfo={userProfileInfo}>
      {
        loading ? 
        <>
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        </>:<>

          {
            notFound ? 
            <>
            <BlogPageHeaderWrapper>
              <BlogPageSubTitle>
                {message}
              </BlogPageSubTitle>
            </BlogPageHeaderWrapper>
            </>:<>
            {displayUsers?.length ? (
                <>
                  <BlogPageHeaderWrapper>
                    <BlogPageTitle>
                      {languageData?.blog_page_title[webSettingData?.language]}
                    </BlogPageTitle>
                    <BlogPageSubTitle>
                      {languageData?.blog_page_sub_title[webSettingData?.language]}
                    </BlogPageSubTitle>
                  </BlogPageHeaderWrapper>

                  <Container>
                    <BlogWrapper>
                      <Row>
                        {displayUsers?.map((item) => (
                          <Col key={item.id} lg="4" md="6" sm="12">
                            <InnerBlogCard>
                              <SingleCard
                                item={item}
                                headerLength="25"
                                descriptaionLength="60"
                                url={`/blog/details/${item?.id}`}
                                id={item?.id}
                              />
                            </InnerBlogCard>
                          </Col>
                        ))}
                      </Row>
                      <PaginationWrapper
                        btnAndBorderColor={webSettingData?.buttoncolor}
                        btnColor={webSettingData?.buttontextcolor}
                      >
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          pageCount={pageCount}
                          onPageChange={changePage}
                          containerClassName={"paginationBttn"}
                          previousLinkClassName={"previousBttn"}
                          nextLinkClassName={"nextBttn"}
                          disabledClassName={"paginationDisabled"}
                        />
                      </PaginationWrapper>
                    </BlogWrapper>
                  </Container>
                </>
              ) : (
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
              )}
            </>
          }
        </>
      }
      
    </Layout>
  );
};

export default AllBlog;
