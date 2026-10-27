export interface TracerStage {
  id: number;
  title: string;
  description: string;
  ttsText: string;
}

export interface Tracer {
  id: string;
  name: string;
  fullName: string;
  color: string;
  targetOrgans: string;
  clinicalUse: string;
  suvRanges: { organ: string; range: string }[];
  prepGuides: { title: string; content: string[] };
  waitTime: number;
  stages: TracerStage[];
  imagePath: string;
}

export const tracers: Tracer[] = [
  {
    id: "fdg",
    name: "18F-FDG",
    fullName: "18F-플루오로디옥시글루코스",
    color: "#3b82f6", // Blue
    targetOrgans: "뇌, 심장, 종양",
    clinicalUse: "암 진단, 뇌 영상, 심장 생존능 평가",
    suvRanges: [
      { organ: "뇌 피질", range: "5.0-12.0" },
      { organ: "심근", range: "3.0-8.0" },
      { organ: "종양", range: "2.5 이상" },
      { organ: "간", range: "2.0-3.5" },
    ],
    prepGuides: {
      title: "18F-FDG 주사 후 60분",
      content: [
        "검사 4~6시간 전부터 금식하세요",
        "당분이 많은 음식과 음료를 피하세요",
        "금속 장신구를 제거하세요"
      ]
    },
    waitTime: 60,
    imagePath: "https://raw.githubusercontent.com/ttty2510-hash/petct-radiopharmaceutical-simulator-manus/main/assets/images/ai_fdg_pet.webp",
    stages: [
      { id: 1, title: "정맥 주사", description: "팔 정맥에 18F-FDG를 주사합니다. 방사성 포도당 유사체가 혈류로 들어갑니다.", ttsText: "1단계. 팔 정맥에 에프디지 방사성의약품을 주사합니다." },
      { id: 2, title: "혈액 순환", description: "주사된 FDG가 혈관을 타고 심장으로 이동한 후 전신으로 퍼집니다.", ttsText: "2단계. 방사성 포도당이 혈류를 타고 전신 장기로 이동하고 있습니다." },
      { id: 3, title: "장기 분포", description: "뇌, 심장, 간 등 주요 장기와 포도당 대사가 활발한 조직으로 분포됩니다.", ttsText: "3단계. 포도당 대사가 활발한 뇌, 심장, 그리고 종양 세포에 약물이 모이게 됩니다." },
      { id: 4, title: "세포 내 포섭", description: "세포 내로 들어간 FDG는 인산화되어 세포 안에 갇히게 됩니다.", ttsText: "4단계. 대사되지 않고 남은 약물은 신장을 거쳐 방광으로 배출됩니다." },
      { id: 5, title: "촬영 대기 (60분)", description: "충분한 영상 대조도를 얻기 위해 60분간 안정을 취하며 대기합니다.", ttsText: "5단계. 체내 분포가 완료되었습니다. 이제 피이티 시티 촬영실로 이동하여 검사를 시작합니다." }
    ]
  },
  {
    id: "fbb",
    name: "18F-FBB",
    fullName: "18F-플루트메타몰",
    color: "#8b5cf6", // Purple
    targetOrgans: "뇌 (베타 아밀로이드)",
    clinicalUse: "알츠하이머병 진단",
    suvRanges: [
      { organ: "음성 스캔", range: "백질에만 국한" },
      { organ: "양성 스캔", range: "피질 전체 확산" }
    ],
    prepGuides: {
      title: "18F-FBB 주사 후 90분",
      content: [
        "특별한 금식은 필요하지 않습니다",
        "금속 장신구를 제거하세요",
        "주사 후 90분간 안정을 취하세요"
      ]
    },
    waitTime: 90,
    imagePath: "https://raw.githubusercontent.com/ttty2510-hash/petct-radiopharmaceutical-simulator-manus/main/assets/images/ai_fbb_pet.webp",
    stages: [
      { id: 1, title: "정맥 주사", description: "팔 정맥에 18F-FBB를 주사합니다. 베타 아밀로이드 표적 약물이 혈류로 들어갑니다.", ttsText: "1단계. 아밀로이드 결합 약물인 에프비비를 정맥 주사합니다." },
      { id: 2, title: "혈류 순환 및 뇌 도달", description: "혈관을 타고 뇌로 이동하여 혈액뇌장벽(BBB)을 통과합니다.", ttsText: "2단계. 주사된 약물이 혈류를 타고 뇌를 향해 이동합니다." },
      { id: 3, title: "베타 아밀로이드 결합", description: "알츠하이머병 환자의 뇌에 축적된 베타 아밀로이드 플라크에 특이적으로 결합합니다.", ttsText: "3단계. 약물이 뇌혈관 장벽을 통과하여 뇌 조직 내부로 침투합니다." },
      { id: 4, title: "비표적 조직 배출", description: "결합하지 않은 약물은 뇌 피질에서 서서히 씻겨 나갑니다.", ttsText: "4단계. 알츠하이머의 원인인 아밀로이드 플라크가 있다면, 약물이 그곳에 강력하게 결합하여 빛을 냅니다." },
      { id: 5, title: "촬영 대기 (90분)", description: "최적의 영상 대조도를 얻기 위해 90분간 안정을 취하며 대기합니다.", ttsText: "5단계. 약 90분이 경과하여 뇌 촬영을 위한 최적의 상태가 되었습니다. 촬영을 시작합니다." }
    ]
  },
  {
    id: "fpcit",
    name: "18F-FP-CIT",
    fullName: "18F-에프피시트",
    color: "#ec4899", // Pink
    targetOrgans: "선조체 (도파민 운반체)",
    clinicalUse: "파킨슨병 진단",
    suvRanges: [
      { organ: "정상 소견", range: "쉼표(,) 모양의 대칭적 섭취" },
      { organ: "비정상 소견", range: "마침표(.) 모양 관찰" }
    ],
    prepGuides: {
      title: "18F-FP-CIT 주사 후 3시간",
      content: [
        "검사 전 최소 4~6시간 금식하세요",
        "금속 장신구를 제거하세요",
        "파킨슨 관련 약물 복용 여부를 알려주세요"
      ]
    },
    waitTime: 180,
    imagePath: "https://raw.githubusercontent.com/ttty2510-hash/petct-radiopharmaceutical-simulator-manus/main/assets/images/ai_fpcit_pet.webp",
    stages: [
      { id: 1, title: "정맥 주사", description: "팔 정맥에 18F-FP-CIT를 주사합니다. 도파민 운반체 표적 약물이 혈류로 들어갑니다.", ttsText: "1단계. 도파민 운반체 결합 약물인 에프피씨아이티를 정맥 주사합니다." },
      { id: 2, title: "혈류 순환 및 뇌 도달", description: "혈관을 타고 뇌로 이동하여 혈액뇌장벽(BBB)을 통과합니다.", ttsText: "2단계. 혈류를 통해 약물이 뇌 조직으로 이동합니다." },
      { id: 3, title: "선조체 도달", description: "뇌 깊은 곳에 위치한 기저핵의 선조체(striatum) 부위에 도달합니다.", ttsText: "3단계. 약물이 뇌 중심부의 선조체 부위에 도달합니다." },
      { id: 4, title: "도파민 운반체 결합", description: "선조체에 존재하는 도파민 운반체(DAT)에 특이적으로 결합합니다.", ttsText: "4단계. 파킨슨병과 관련된 도파민 신경세포 말단에 약물이 선택적으로 결합합니다." },
      { id: 5, title: "촬영 대기 (180분)", description: "결합하지 않은 약물이 빠져나가고 최적의 영상을 얻기 위해 3시간 대기합니다.", ttsText: "5단계. 약 3시간이 경과하여 촬영 준비가 완료되었습니다. 피이티 시티 촬영을 시작합니다." }
    ]
  },
  {
    id: "psma",
    name: "68Ga-PSMA",
    fullName: "68갈륨-PSMA-11",
    color: "#f59e0b", // Orange/Amber
    targetOrgans: "전립선, 림프절, 뼈",
    clinicalUse: "전립선암 진단 및 병기 결정",
    suvRanges: [
      { organ: "전립선 종양", range: "5.0-40.0" },
      { organ: "전이 림프절", range: "3.0-20.0" },
      { organ: "골 전이", range: "4.0-25.0" },
      { organ: "신장", range: "20.0-60.0" },
    ],
    prepGuides: {
      title: "68Ga-PSMA 주사 후 60분",
      content: [
        "검사 전 특별한 금식은 필요하지 않습니다",
        "금속 장신구를 제거하세요",
        "주사 후 60분간 안정을 취하세요"
      ]
    },
    waitTime: 60,
    imagePath: "https://raw.githubusercontent.com/ttty2510-hash/petct-radiopharmaceutical-simulator-manus/main/assets/images/ai_psma_pet.webp",
    stages: [
      { id: 1, title: "정맥 주사", description: "팔 정맥에 68Ga-PSMA를 주사합니다. PSMA 결합 추적자가 혈류로 들어갑니다.", ttsText: "1단계. 전립선암 표적 약물인 피에스엠에이를 정맥 주사합니다." },
      { id: 2, title: "혈액 순환", description: "혈관을 타고 전신으로 이동하며 특히 혈류가 풍부한 장기로 퍼집니다.", ttsText: "2단계. 약물이 전신 혈류를 따라 순환하기 시작합니다." },
      { id: 3, title: "전립선 특이 항원(PSMA) 결합", description: "전립선암 세포 표면에 과발현된 PSMA 단백질에 특이적으로 결합합니다.", ttsText: "3단계. 약물이 전립선암 세포 표면에 존재하는 특이 항원에 도달합니다." },
      { id: 4, title: "종양 및 전이 병소 축적", description: "원발성 전립선암뿐만 아니라 림프절이나 뼈에 전이된 병소에도 축적됩니다.", ttsText: "4단계. 암세포 표면 수용체와 강력하게 결합하며 전이된 세포에도 동일하게 결합합니다." },
      { id: 5, title: "신장 배설 및 촬영 대기", description: "대사되지 않은 약물은 신장을 통해 소변으로 배출되며 60분 후 촬영합니다.", ttsText: "5단계. 잔여 약물 배출을 위해 촬영 직전 소변을 보고 촬영을 시작합니다." }
    ]
  }
];