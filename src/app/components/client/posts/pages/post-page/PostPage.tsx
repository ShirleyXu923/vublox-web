import {
  useParams,
} from 'react-router-dom';
import { Container } from 'reactstrap';

import PostContent from './components/content/PostContent';

function PostPage() {
  const params = useParams();

  return (
    <Container className="main-container post-page-container">
      <Container className="post-page">
        <PostContent id={params.id ?? ''} />
      </Container>
    </Container>
  );
}

export default PostPage;
