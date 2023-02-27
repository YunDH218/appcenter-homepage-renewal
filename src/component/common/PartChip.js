import styled from "styled-components";
import {partInfo} from "../../resource/string/partInfo";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {viewWidthCalc} from "../../lib/viewportCalculate";

export function PartChip({url = partInfo[0].fullUrl, onButtonClick, common = true}) {
    return (
        <>
            <ButtonGroup>
                {partInfo.map((part, index) => (
                    (!common && !index)
                        ? null
                        : <Button
                            key={part.id}
                            className={url === part.fullUrl ? 'active' : ''}
                            onClick={e => onButtonClick(e, part.url)}
                        >{part.partName}</Button>
                ))}
            </ButtonGroup>
        </>
    )
}

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  Button {
    outline: none;
    color: ${props => props.theme.color.gray};
    font-weight: 600;
    padding: 8px 40px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 999px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, .25);
    text-transform: none;
    font-size: ${props => props.theme.fontSize.bigDesktop.caption};
    @media (max-width: 1800px) {
      font-size: ${props => props.theme.fontSize.desktop.caption};
    }
    @media (max-width: 1200px) {
      font-size: ${props => props.theme.fontSize.tablet.caption};
    }
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontSize.smallTablet.caption};
    }
    @media (max-width: 576px) {
      font-size: ${props => props.theme.fontSize.mobile.caption};
    }
  }

  Button.active {
    color: ${props => props.theme.color.primary};
    border: solid 1px ${props => props.theme.color.primary};
    box-shadow: 0 4px 4px rgba(23, 115, 224, .25); // 이렇게 해도 예쁜 것 같음
  }
`;