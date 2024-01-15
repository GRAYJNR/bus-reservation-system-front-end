import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Container from "../../bootstrap/Container";
import Layout from "../../bootstrap/Layout/";
import {
  WorkDescription,
  WorkImage,
  WorkTitle,
  WorkPersonTitle,
  WorkWrapper,
} from "./SingleTestimonial.styles.js";

const SingleTestimonial = () => {
  const [singleTestimonial, setSingleTestimonial] = useState([]);
  const { id } = useParams();
  const [userProfileInfo, setUserProfileInfo] = useState(null);

  useEffect(() => {
    setUserProfileInfo(JSON.parse(localStorage.getItem("userProfileInfo")));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_DOMAIN}/comments/${id}`)
      .then((res) => res.json())
      .then((data) => { console.log(data); setSingleTestimonial(data.data) });
  }, [id]);

  return (
    <Layout title={`testimonial ${id}`} userProfileInfo={userProfileInfo}>
      <Container>
        <WorkWrapper>
          <WorkImage src={singleTestimonial.image} alt="workImage" />
          <WorkTitle>{singleTestimonial.person_name}</WorkTitle>
          <WorkPersonTitle>{singleTestimonial.person_detail}</WorkPersonTitle>

          <WorkDescription
            dangerouslySetInnerHTML={{ __html: singleTestimonial.description }}
          ></WorkDescription>
        </WorkWrapper>
      </Container>
    </Layout>
  );
};

export default SingleTestimonial;
