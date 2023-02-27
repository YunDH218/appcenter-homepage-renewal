import styled from "styled-components";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {PartChip} from "../component/common/PartChip";

export default function FAQDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <>
            <FAQDetailBox>
                <PartChip
                    url={location.pathname}
                    onButtonClick={(e, part) => navigate(part)}
                />
                <Outlet/>
            </FAQDetailBox>
        </>
    );
}

const FAQDetailBox = styled.div`
  margin: 0 auto;
  padding-top: 100px;
  max-width: 1200px;
  @media (max-width: 1400px) {
    margin: 0 100px;
  }

  h1 {
    font-size: 70px;
    font-weight: 700;
    color: ${props => props.theme.color.primary};
  }
`;

