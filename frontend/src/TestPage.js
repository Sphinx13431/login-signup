import { useNavigate } from "react-router-dom";
import "./TestPage.css"; // Import the updated CSS file

const TestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="test-container">
      <div className="test-card">
        <h1 className="test-title">Test Page</h1>
        <p className="test-description">
          Ready to challenge yourself? Take the test now or view your previous results.
        </p>
        <div className="button-container">
          <button className="test-button take-test" onClick={() => navigate("/quiz")}>
            Take Test
          </button>
          <button className="test-button view-results" onClick={() => navigate("/test-results")}>
            View Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
