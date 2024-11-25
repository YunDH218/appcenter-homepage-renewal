import { deleteInroduction } from '@/apis/intro';
import ModalBox from '@/components/common/ModalBox';
import { THEME } from '@/constants/theme';
import { IntroductionEntity } from '@/types/introType';
import BtnBox from '../common/BtnBox';

interface MemDeleteModalProps {
  setIsDeleteBtnClick: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRow: IntroductionEntity | null;
}

const MemDeleteModal = ({
  setIsDeleteBtnClick,
  selectedRow,
}: MemDeleteModalProps) => {
  const onDeleteClick = async () => {
    if (selectedRow && selectedRow.id !== null) {
      try {
        await deleteInroduction(selectedRow.id);
        setIsDeleteBtnClick(false);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <ModalBox>
      <p className='text-xl font-bold'>
        {selectedRow?.title} 앱을 삭제하겠습니까?
      </p>
      <div className='flex flex-row justify-center gap-2'>
        <BtnBox text='삭제' color={THEME.COLORS.RED} onClick={onDeleteClick} />
        <BtnBox
          text='취소'
          color={THEME.COLORS.GRAY}
          onClick={() => setIsDeleteBtnClick(false)}
        />
      </div>
    </ModalBox>
  );
};

export default MemDeleteModal;
