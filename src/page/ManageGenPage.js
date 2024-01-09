import styled, { css } from 'styled-components';
import { HiBars3 } from "react-icons/hi2";
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Modal from "react-modal"; // react-modal 라이브러리 import
import Pagination from '../component/manage/Pagenation';


export default function ManageGenPage() {
  const [data, setData] = useState([]);

  // 새 멤버를 추가할 때 사용합니다.
  const [newRole, setNewRole] = useState({
    role_id: '',
    member_id: '',
    part: '',
    year: 15,
  });
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const contextMenuRef = useRef(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  
  //* 수정 기능을 이용할 때 값을 저장하기 위해 사용합니다.. */
  const [editedRole, setEditedRole] = useState("");
  const [editedGen, setEditedGen] = useState("");

  // 페이지네이션을 구현할때 사용합니다.
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 페이지당 데이터를 분할하는 함수입니다.
  const paginateData = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getCurrentPageData = () => {
    return paginateData(data, currentPage, itemsPerPage);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openEditModal = (selectedGroupId) => {
    // 수정할 때 해당 memberId의 데이터를 가져와서 모달에 미리 채워넣을 수 있습니다.
    setContextMenuVisible(false);
    setEditModalOpen(true);
  };

  useEffect(() => {
    const memberToEdit = data.find((item) => item.group_id === selectedGroupId);
    if (memberToEdit) {
      setEditedRole(memberToEdit.role);
      setEditedGen(memberToEdit.generation);
    }
  },[selectedGroupId]);

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const addData = async () => {
    try {
      const result = await axios.post(`https://server.inuappcenter.kr/groups?member_id=${newRole.member_id}&role_id=${newRole.role_id}`, 
        newRole
      );
      console.log('Success:', result.data);

      // POST 요청 성공 시, 새로운 역할을 data 상태 변수에 추가합니다.
      setData([...data, result.data]);

      setNewRole({
        role_id: '',
        member_id: '',
        part: '',
        year: 16,
      });
    } catch (error) {
      console.error("Error adding data:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const viewData = await axios.get('https://server.inuappcenter.kr/groups/public/all-groups-members').then(res => {
          setData(res.data);
        });
    }
    fetchData(); 
  }, []);

  useEffect(() => {
    const handleContextMenuClick = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        // 컨텍스트 메뉴 외의 영역을 클릭하면 메뉴를 닫습니다.
        setContextMenuVisible(false);
      }
    };

    window.addEventListener('click', handleContextMenuClick);

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
      window.removeEventListener('click', handleContextMenuClick);
    };
  }, []);

  const handleEdit = async () => {
    if (selectedGroupId === null) {
      return; // 선택된 항목이 없으면 무시
    }
  
    // 수정할 데이터를 가져옵니다.
    const updatedData = {
      role: editedRole,
      generation: editedGen,
    };
  
    try {
      // group_id를 사용하여 수정 요청을 보냅니다.
      const response = await axios.patch(
        `https://server.inuappcenter.kr/groups?id=${selectedGroupId}`,
        updatedData
      );
      console.log("Member with ID", selectedGroupId, "has been updated.");
      console.log(response);
      // 업데이트된 데이터를 data 상태에서 업데이트합니다.
      setData((prevData) =>
        prevData.map((item) =>
          item.group_id=== selectedGroupId ? { ...item, ...updatedData } : item
        )
      );
      
    } catch (error) {
      console.error("Error updating member:", error);
    }
    setEditModalOpen(false);
    setContextMenuVisible(false); // 컨텍스트 메뉴 닫기
  };

  const handleDelete = async () => {
    if (selectedGroupId === null) {
      return; // 선택된 항목이 없으면 무시
    }
  
    try {
      // member_id를 사용하여 삭제 요청을 보냅니다.
      await axios.delete(`https://server.inuappcenter.kr/groups?${selectedGroupId}`);
      console.log("Member with ID", selectedGroupId, "has been deleted.");
  
      // 삭제한 데이터를 data 상태에서 제거합니다.
      setData((prevData) => prevData.filter((item) => item.group_id !== selectedGroupId));
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  
    setContextMenuVisible(false); // 컨텍스트 메뉴 닫기
  };

    return (
    <>
      <NavBar>
        <span className='logo'>흑백 로고</span>
        <HiBars3 className='menu' size={'24px'} />
      </NavBar>
      <IntroBox>
        <Text type='title'>{'기수 관리'}</Text>
        <Text type='top'>{'기수에 역할과 동아리원을 추가, 삭제, 수정을 할 수 있어요'}</Text>
      </IntroBox>
        <MemberList>
            편성 목록
        </MemberList>
      <MemberTable>
        <tbody>
        {getCurrentPageData().map((content) => (
            <tr key={content.group_id}
            onContextMenu={(e) => {
              e.preventDefault();
              setSelectedGroupId(content.group_id);
              setContextMenuPosition({ x: e.clientX, y: e.clientY });
              setContextMenuVisible(true);
              console.log(content.group_id);
            }}
            >
              <td>{content.group_id}</td>
              <td>{content.generation}</td>
              <td>{content.name}</td>
              <td>
                <a href={content.blogLink} target='_blank' rel='noopener noreferrer'>
                  Visit Blog
                </a>
              </td>
              <td>
                <a href={content.gitRepositoryLink} target='_blank' rel='noopener noreferrer'>
                  github
                </a>
              </td>
              <td>{content.profileImage}</td>
              <td>{content.part}</td>
            </tr>
          ))}
        </tbody>
      </MemberTable>
      <PaginationContainer>
        {/* 페이지네이션 컨텐츠 */}
        <Pagination
          currentPage={currentPage}
          totalItems={data.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </PaginationContainer>
      <Addtitle>
        편성 추가
      </Addtitle> 
      <AddList>
        {/* 사용자 입력을 받을 UI 요소들 */}
        <AddMember
          type="text"
          placeholder="동아리원_id"
          value={newRole.member_id}
          onChange={(e) =>
            setNewRole({ ...newRole, member_id: e.target.value })
          }
        />
        <AddMember
          type="text"
          placeholder="역할_id"
          value={newRole.role_id}
          onChange={(e) =>
            setNewRole({ ...newRole, role_id: e.target.value })
          }
        />
        <AddMember
          type="text"
          placeholder="파트명"
          value={newRole.part}
          onChange={(e) =>
            setNewRole({ ...newRole, part: e.target.value })
          }
        />
        <AddMember
          type="number"
          placeholder="기수"
          value={newRole.year}
          onChange={(e) =>
            setNewRole({ ...newRole, year: e.target.value })
          }
        />
      <Regisbutton onClick={addData}>등록</Regisbutton>
      </AddList>
      {/* 컨텍스트 메뉴 */}
      {contextMenuVisible && (
        <ContextMenu
          ref={contextMenuRef}
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <MenuItem onClick={openEditModal}>수정</MenuItem>
          <MenuItem onClick={handleDelete}>삭제</MenuItem>
        </ContextMenu>
      )}

      {/* 수정 팝업 모달 */}
      <ModalContainer
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Member Modal"
      >
        <ModalTitle>역할 수정</ModalTitle>
        <ModalLabel>파트</ModalLabel>
        <ModalInput
          type="text"
          value={editedRole}
          onChange={(e) => setEditedRole(e.target.value)}
        />
        <ModalInput
          type="number"
          value={editedGen}
          onChange={(e) => setEditedGen(e.target.value)}
        />
        <ModalButtonWrapper>
          <ModalButton onClick={handleEdit}>수정 완료</ModalButton>
          <ModalButton onClick={closeEditModal}>취소</ModalButton>
        </ModalButtonWrapper>
      </ModalContainer>
    </>
  );
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px; /* 조정 가능한 마진 값 */
`;

const ModalContainer = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const ModalLabel = styled.label`
  font-size: 1rem;
  margin-bottom: 5px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const ModalButton = styled.button`
  background-color: #5858fa;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  & + & {
    margin: 0 10px;
  }

  &:hover {
    background-color: #8181f7;
  }
`;

const MenuItem = styled.div`
  padding: 5px 10px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: #f2f2f2;
  }
`;

const ContextMenu = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  color: grey;
`;

const Regisbutton = styled.button`
  border: none;
  background-color: #5858FA;
  border-radius: 5px;
  color: white;
  width: 5rem;
  height: 2rem;
  margin: 2rem -3.5rem 0 auto;

  &:hover {
    transition: 0.1s ease-in;
    background-color: #8181F7;
  }
`;

const AddMember = styled.input`
  border-radius: 5px;
  width: 80px;
  height: 22px;
  

  :first-child {
    margin-right: 5px;
    width: 80px;
  }

  & + & {
    margin-right: 5px;
  }

  ::placeholder {
    text-align: center;
  }
`

const MemberTable = styled.table`
  width: 700px;
  border-collapse: collapse;
  margin: 20px auto 20px auto;

  th,
  td {
    padding: 5px;
    text-align: center;
  }

  th {
    font-weight: 700;
  }

  a {
    color: #0078d4;
    text-decoration: none;
  }

  tr {
    border-radius: 20%;
  }

  tr:hover {
    background-color:#f2f2f2;
  }
`;

const AddList = styled.div`
    display: flex;
    justify-content:center;
    position: relative;
    flex-wrap: wrap;
    height: 25px;
    width: 400px;
    margin: 0 auto;

    font-size: 1.6rem;
    padding-left: 2.5rem;
    
    .menu {
        margin-left: auto;
    }
`

const Addtitle = styled.div`
    position:absolute;
    display: flex;
    position: relative;
    height: 25px;
    width: 730px;
    margin: 0  auto 1.5rem auto;
    font-size: 1.6rem;
    
    .menu {
        margin-left: auto;
    }
`

const MemberList = styled.div`
    position:absolute;
    display: flex;
    position: relative;
    height: 25px;
    width: 730px;
    margin: 0 auto 0 auto;
    font-size: 1.6rem;
    
    .menu {
        margin-left: auto;
    }
`


const NavBar = styled.div`
    position:absolute;
    display: flex;
    position: relative;
    height: 25px;
    width: 730px;
    margin: 45px auto 0 auto;
    
    .menu {
        margin-left: auto;
    }
`;

const IntroBox = styled.div`
    position: relative;
    width: 700px;
    height: 130px;
    background-color: #F2F2F2;
    margin: 0 auto 2rem auto;
    top: 20px;
    border-radius: 20px;
    padding-top: 50px;
`;

const Text = styled.div`
    font-style: normal;
    text-align:center;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${(props) => (props.type === 'title' ? '#424242' : '#848484')};
    font-weight: ${(props) =>
        props.type === 'top' ? 100 : props.type === 'title' ? 600 : 100};
    margin-bottom: 3px;
    white-space: pre-line;

    ${(props) =>
        props.type === 'title'
            ? css`
                  font-size: ${(props) =>
                      props.theme.fontSize.tablet.title};`
            : css`
                  font-size: ${(props) =>
                      props.theme.fontSize.tablet.caption};`}
`;