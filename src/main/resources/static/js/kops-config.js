(() => {
  'use strict';

  const formTypes = [
    '견본품 제공',
    '학술대회 지원',
    '임상시험 등의 지원',
    '제품설명회',
    '시판 후 조사',
    '대금결제 조건에 따른 비용할인',
    '구매 전 의료기기의 성능 확인을 위한 사용'
  ];

  const screens = [
    { id: 'home', group: '홈', title: '지출보고서 관리시스템', type: 'home', source: 'app/com/main/index' },

    { id: 'publish-data', group: '지출보고서 정보공개', section: '공개자료', title: '지출보고서 공표자료', type: 'publicList', dataset: 'selectOggBriefOfanDataSrchList.ndo', source: 'OggBriefOfanDataList' },
    { id: 'public-search', group: '지출보고서 정보공개', section: '공개자료', title: '지출보고서 공개자료조회', type: 'publicList', dataset: 'selectOggBriefPubDataSrchList.ndo', source: 'OggBriefPubDataSrch' },
    { id: 'company-public', group: '지출보고서 정보공개', section: '공개자료', title: '업체별 지출보고서 공개 현황', type: 'publicList', dataset: 'selectOggBriefPubDataSrchList.ndo', source: 'EntpOggBriefPubInfoList' },
    { id: 'statistics', group: '지출보고서 정보공개', section: '통계', title: '한눈에 보는 지출보고서 통계', type: 'statistics', dataset: 'selectAllSeeStcInfoPgList.ndo', source: 'AllSeeOggWrptStc' },
    { id: 'benefit-provider', group: '지출보고서 정보공개', section: '통계', title: '합법적 경제적 이익 제공자', type: 'statistics', dataset: 'selectAllSeeStcList.ndo', source: 'LawEcnmyPftOffrrList' },
    { id: 'benefit-offer', group: '지출보고서 정보공개', section: '통계', title: '합법적 경제적 이익 제공내역', type: 'statistics', dataset: 'selectOffrDescPecnyAstc1.ndo', source: 'LawEcnmyPftOffrrDtlList' },
    { id: 'benefit-receive', group: '지출보고서 정보공개', section: '통계', title: '합법적 경제적 이익 수수내역', type: 'statistics', dataset: 'selectAcpDescPecnyAstc1.ndo', source: 'LawEcnmyPftAcpDtlList' },

    { id: 'report-status', group: '지출보고서 작성·정정', section: '현황', title: '지출보고서 현황 조회', type: 'workList', source: 'OggBriefWrtPrsntList' },
    { id: 'company-status', group: '지출보고서 작성·정정', section: '현황', title: '업체별 지출보고서 현황', type: 'workList', source: 'EntpOggBriefFormPrsntList', hidden: true },
    { id: 'company-info', group: '지출보고서 작성·정정', section: '작성', title: '업체 기본정보 작성', type: 'form', source: 'EntpInfmWrt' },
    { id: 'report-write', group: '지출보고서 작성·정정', section: '작성', title: '지출보고서 작성', type: 'workList', source: 'OggBriefWrtList' },
    { id: 'company-write', group: '지출보고서 작성·정정', section: '작성', title: '업체별 지출보고서 작성', type: 'workList', source: 'EntpOggBriefFormWrtList', hidden: true },
    { id: 'company-update', group: '지출보고서 작성·정정', section: '정정', title: '업체별 지출보고서 정정', type: 'workList', source: 'EntpOggBriefFormUpdList', hidden: true },
    { id: 'regular-write', group: '지출보고서 작성·정정', section: '작성', title: '정기 지출보고서 작성', type: 'workList', source: 'OggBriefOrtmWrtList' },
    { id: 'report-correct', group: '지출보고서 작성·정정', section: '정정', title: '지출보고서 정정', type: 'workList', source: 'OggBriefWrtUpdList' },
    { id: 'file-check', group: '지출보고서 작성·정정', section: '제출', title: '파일 검증 현황', type: 'workList', source: 'FileExmPrsntList' },
    { id: 'final-decision', group: '지출보고서 작성·정정', section: '제출', title: '최종 확정 현황', type: 'workList', source: 'LastFdecList' },
    { id: 'report-guide', group: '지출보고서 작성·정정', section: '안내', title: '지출보고서 작성 기본 안내', type: 'info', source: 'OggBriefBseLte' },

    { id: 'hospital-info', group: '기관정보 관리', section: '기관정보', title: '요양기관 정보 관리', type: 'workList', source: 'YadmInfmList' },
    { id: 'medicine-info', group: '기관정보 관리', section: '기관정보', title: '의약품 정보 관리', type: 'workList', source: 'MsupInfmList' },
    { id: 'device-info', group: '기관정보 관리', section: '기관정보', title: '의료기기 정보 관리', type: 'workList', source: 'MeqipInfmList' },

    { id: 'notice', group: '알림·지원', section: '알림마당', title: '공지사항', type: 'notice', dataset: 'selectNtfclteList.ndo', source: 'Ntfclte' },
    { id: 'notice-detail', group: '알림·지원', section: '알림마당', title: '공지사항 상세', type: 'detail', source: 'NtfclteDtl', hidden: true },
    { id: 'faq', group: '알림·지원', section: '알림마당', title: '자주 묻는 질문', type: 'faq', dataset: 'selectFaqList.ndo', source: 'Faq' },
    { id: 'reference', group: '알림·지원', section: '알림마당', title: '자료실', type: 'board', dataset: 'selectRfrmList.ndo', source: 'Rfrm' },
    { id: 'reference-detail', group: '알림·지원', section: '알림마당', title: '자료실 상세', type: 'detail', source: 'RfrmDtl', hidden: true },
    { id: 'education', group: '알림·지원', section: '교육', title: '교육 신청', type: 'education', source: 'EduApl' },
    { id: 'education-write', group: '알림·지원', section: '교육', title: '교육 신청서 작성', type: 'form', source: 'EduAplWrt', hidden: true },
    { id: 'education-detail', group: '알림·지원', section: '교육', title: '교육 상세', type: 'detail', source: 'EduAplDtl', hidden: true },
    { id: 'education-guide', group: '알림·지원', section: '교육', title: '교육 안내', type: 'info', source: 'EduAplDtlDesc', hidden: true },
    { id: 'transfer', group: '알림·지원', section: '정보이관', title: '정보이관 신청 내역', type: 'workList', source: 'InfmTrfrAplList' },
    { id: 'transfer-write', group: '알림·지원', section: '정보이관', title: '정보이관 신청', type: 'form', source: 'InfmTrfrAplWrt', hidden: true },

    { id: 'system-overview', group: '시스템 안내', section: 'KOPS 소개', title: '시스템 개요', type: 'info', source: 'SysSmryInfoM01' },
    { id: 'system-history', group: '시스템 안내', section: 'KOPS 소개', title: '추진 경과', type: 'history', source: 'TxtrHistoryInfoM01' },
    { id: 'system-status', group: '시스템 안내', section: 'KOPS 소개', title: '지출보고서 제도 현황', type: 'info', source: 'TxtrPrsntInfoM01' },
    { id: 'related-law', group: '시스템 안내', section: '법령·정책', title: '관련 법령', type: 'board', source: 'RelLawInfoM01' },
    { id: 'location', group: '시스템 안내', section: '이용안내', title: '찾아오시는 길', type: 'map', source: 'MapLoadM01' },
    { id: 'accessibility', group: '시스템 안내', section: '이용안내', title: '웹 접근성 안내', type: 'info', source: 'WebAccessibilityM01' },
    { id: 'screen-access', group: '시스템 안내', section: '이용안내', title: '화면 접근 알림', type: 'info', source: 'ScnAccesNtfcP01', hidden: true },

    { id: 'my-report', group: '마이페이지', section: '나의 업무', title: '나의 지출보고서 현황', type: 'workList', source: 'MyOggBriefPrsnt' },
    { id: 'care-report', group: '마이페이지', section: '나의 업무', title: '요양기관 지출보고서 조회', type: 'workList', source: 'YoyangOggBriefList' },
    { id: 'extra-data', group: '마이페이지', section: '나의 업무', title: '추가자료 요구 제출', type: 'form', source: 'AddDataDmndPrsntSmit' },
    { id: 'profile', group: '마이페이지', section: '회원정보', title: '회원정보 수정', type: 'form', source: 'MbInfmUpd' },
    { id: 'profile-company', group: '마이페이지', section: '회원정보', title: '법인회원 정보 수정', type: 'form', source: 'MbInfmUpdFirmCso', hidden: true },
    { id: 'profile-personal', group: '마이페이지', section: '회원정보', title: '개인회원 정보 수정', type: 'form', source: 'MbInfmUpdIndvCso', hidden: true },
    { id: 'profile-confirm', group: '마이페이지', section: '회원정보', title: '회원정보 확인', type: 'form', source: 'MbInfmUpdInfmCfr', hidden: true },
    { id: 'password', group: '마이페이지', section: '회원정보', title: '비밀번호 변경', type: 'password', source: 'MbInfmUpdPwd' },
    { id: 'withdraw', group: '마이페이지', section: '회원정보', title: '회원 탈퇴', type: 'withdraw', source: 'MbInfmOt' },
    { id: 'withdraw-complete', group: '마이페이지', section: '회원정보', title: '회원 탈퇴 완료', type: 'complete', source: 'MbInfmOtEnd', hidden: true }
  ];

  formTypes.forEach((name, index) => {
    const number = index + 1;
    screens.push(
      { id: `public-form-${number}`, group: '지출보고서 정보공개', section: '서식별 공개', title: `지출보고서 서식별 공개 (${name})`, type: 'publicList', dataset: `selectOggBriefPub${number}List.ndo`, source: `OggBriefPubDataSrchDtl${number}`, hidden: true },
      { id: `status-form-${number}`, group: '지출보고서 작성·정정', section: '현황', title: `지출보고서 서식별 조회 (${name})`, type: 'workList', source: `OggBriefFormPrsntList${number}`, hidden: true },
      { id: `write-form-${number}`, group: '지출보고서 작성·정정', section: '작성', title: `지출보고서 서식 작성 (${name})`, type: 'form', source: `OggBriefFormWrtList${number}`, hidden: true },
      { id: `update-form-${number}`, group: '지출보고서 작성·정정', section: '정정', title: `지출보고서 서식 정정 (${name})`, type: 'form', source: `OggBriefFormUpdList${number}`, hidden: true }
    );
  });

  window.KOPS_CONFIG = { screens, formTypes };
})();
