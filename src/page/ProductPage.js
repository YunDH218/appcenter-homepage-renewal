import styled, { css } from 'styled-components';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Pagination from '../component/manage/Pagenation';
import RegisModal from '../container/product/RegisModal';
import { RMopen, MODopen } from '../modules/ProductSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import ModifyModal from '../container/product/ModifyModal';
import InOut from '../component/common/InOut';
import IntroBox from '../component/admin/IntroBox';
import { introInfo } from '../resource/data/adminInfo';

export default function ProductPage() {
    const [data, setData] = useState([]);
    const [loading, isLoading] = useState(false);

    const regisModalOpen = useSelector((state) => state.product.regisModalOpen);
    // prettier-ignore
    const modifyModalOpen = useSelector((state) => state.product.modifyModalOpen);
    const dispatch = useDispatch();

    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({
        x: 0,
        y: 0,
    });
    const [selectedProductId, setselectedProductId] = useState(null);
    const contextMenuRef = useRef(null);
    const [productId, setProductId] = useState('');

    //* 수정 기능을 이용할 때 값을 저장하기 위해 사용합니다. */
    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedProfileImage, setEditedProfileImage] = useState('');
    const [editedBlogLink, setEditedBlogLink] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedGitRepositoryLink, setEditedGitRepositoryLink] = useState('');

    // 페이지네이션을 구현할때 사용합니다.
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

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

    const openEditModal = (selectedProductId) => {
        // 수정할 때 해당 memberId의 데이터를 가져와서 모달에 미리 채워넣을 수 있습니다.
        setContextMenuVisible(false);
        dispatch(MODopen());
    };

    useEffect(() => {
        const memberToEdit = data.find((item) => item.id === selectedProductId);
        if (memberToEdit) {
            setEditedName(memberToEdit.name);
            setEditedDescription(memberToEdit.description);
            setEditedProfileImage(memberToEdit.profileImage);
            setEditedBlogLink(memberToEdit.blogLink);
            setEditedEmail(memberToEdit.email);
            setEditedGitRepositoryLink(memberToEdit.gitRepositoryLink);
        }
    }, [selectedProductId]);

    const addData = () => {
        dispatch(RMopen());
        scrollLock();
    };

    const scrollLock = useCallback(() => {
        document.body.style.overflow = 'hidden';
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            isLoading(true);
            const viewData = await axios
                .get(
                    'https://server.inuappcenter.kr/introduction-board/public/all-boards-contents'
                )
                .then((res) => {
                    isLoading(false);
                    setData(res.data);
                    console.log(res.data);
                });
        };
        fetchData();
    }, [regisModalOpen, modifyModalOpen]);

    useEffect(() => {
        const handleContextMenuClick = (e) => {
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(e.target)
            ) {
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

    const handleDelete = async () => {
        if (selectedProductId === null) {
            return; // 선택된 항목이 없으면 무시
        }

        try {
            // id를 사용하여 삭제 요청을 보냅니다.
            await axios.delete(
                `https://server.inuappcenter.kr/introduction-board/${selectedProductId}`
            );
            console.log(
                'Member with ID',
                selectedProductId,
                'has been deleted.'
            );

            // 삭제한 데이터를 data 상태에서 제거합니다.
            setData((prevData) =>
                prevData.filter((item) => item.id !== selectedProductId)
            );
        } catch (error) {
            console.error('Error deleting member:', error);
        }

        setContextMenuVisible(false); // 컨텍스트 메뉴 닫기
    };
    return (
        <>
            <InOut />
            <IntroBox introInfo={introInfo[5]} />
            <MemberList>앱 목록</MemberList>
            <MemberTable>
                {loading && <div>loading...</div>}
                <tbody>
                    {getCurrentPageData().map((content) => (
                        <tr
                            key={content.id}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setselectedProductId(content.id);
                                setContextMenuPosition({
                                    x: e.clientX,
                                    y: e.clientY,
                                });
                                setContextMenuVisible(true);
                                setProductId(content.id);
                                console.log(content.id);
                            }}
                        >
                            <AppTd>
                                <figure>
                                    <AppImage
                                        src={
                                            content.images[
                                                Object.keys(content.images)[0]
                                            ]
                                        }
                                    />
                                </figure>
                            </AppTd>
                            <td>{content.title}</td>
                            <td>{content.subTitle}</td>
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
                <Regisbutton
                    onClick={() => {
                        addData();
                    }}
                >
                    등록
                </Regisbutton>
            </PaginationContainer>
            {regisModalOpen && <RegisModal regisModalOpen={regisModalOpen} />}
            {modifyModalOpen && <ModifyModal id={productId} />}
            {/* 컨텍스트 메뉴 */}
            {contextMenuVisible && (
                <ContextMenu
                    ref={contextMenuRef}
                    style={{
                        top: contextMenuPosition.y,
                        left: contextMenuPosition.x,
                    }}
                >
                    <MenuItem onClick={openEditModal}>수정</MenuItem>
                    <MenuItem onClick={handleDelete}>삭제</MenuItem>
                </ContextMenu>
            )}
        </>
    );
}

const AppTd = styled.td`
    width: 200px;
    ${({ regisModalOpen }) =>
        regisModalOpen &&
        `   opacity: 0.1;
`}
`;

const AppImage = styled.img`
    width: 7rem;
    height: 7rem;
    max-height: 200px;
    object-fit: cover;
    border-radius: 8px;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

const MenuItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50%;
    border-bottom: 1px solid #ccc;
    padding: 5px 10px;
    cursor: pointer;
    user-select: none;
    &:hover {
        background-color: #f2f2f2;
    }
`;

const ContextMenu = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100px;
    height: 100px;
    background-color: white;
    border-radius: 8px;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    color: grey;
`;

const Regisbutton = styled.button`
    position: absolute;
    border: none;
    background-color: grey;
    border-radius: 5px;
    color: white;
    width: 5rem;
    height: 2rem;
    margin-left: 30rem;
    margin-top: 0.6rem;

    &:hover {
        transition: 0.1s ease-in;
        background-color: #8181f7;
    }
`;

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
        background-color: #f2f2f2;
    }
`;

const MemberList = styled.div`
    position: absolute;
    display: flex;
    position: relative;
    height: 25px;
    width: 730px;
    margin: 0 auto 0 auto;
    font-size: 1.6rem;

    .menu {
        margin-left: auto;
    }
`;