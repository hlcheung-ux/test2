import { Poem } from './types';

// Helper to clean text and split into roughly 10-20 char chunks by punctuation
const processPoem = (title: string, author: string, id: string, rawText: string): Poem => {
  // Remove newlines and excessive spaces, keep punctuation for splitting logic
  const cleanText = rawText.replace(/\s+/g, '');
  
  const chunks: string[] = [];
  let currentChunk = "";
  
  // Simple algorithm to group by punctuation but enforce 10-20 chars constraint where possible
  // Note: For this specific game logic, we strip punctuation for the *grid*, 
  // but we process chunks based on meaning.
  
  // Manually defining chunks for better gameplay flow for these specific poems
  // as algorithmic splitting for Classical Chinese can be tricky without NLP.
  
  let manualChunks: string[] = [];

  if (id === 'bingchexing') {
    manualChunks = [
      "車轔轔馬蕭蕭",
      "行人弓箭各在腰",
      "耶孃妻子走相送",
      "塵埃不見咸陽橋",
      "牽衣頓足攔道哭",
      "哭聲直上干雲霄",
      "道旁過者問行人",
      "行人但云點行頻",
      "或從十五北防河",
      "便至四十西營田",
      "去時里正與裹頭",
      "歸來頭白還戍邊",
      "邊庭流血成海水",
      "武皇開邊意未已",
      "君不見漢家山東二百州",
      "千村萬落生荊杞",
      "縱有健婦把鋤犁",
      "禾生隴畝無東西",
      "況復秦兵耐苦戰",
      "被驅不異犬與雞",
      "長者雖有問役夫敢申恨",
      "且如今年冬未休關西卒",
      "縣官急索租租稅從何出",
      "信知生男惡反是生女好",
      "生女猶得嫁比鄰",
      "生男埋沒隨百草",
      "君不見青海頭古來白骨無人收",
      "新鬼煩冤舊鬼哭",
      "天陰雨濕聲啾啾"
    ];
  } else if (id === 'taohuayuanji') {
    manualChunks = [
      "晉太元中武陵人捕魚為業",
      "緣溪行忘路之遠近",
      "忽逢桃花林夾岸數百步",
      "中無雜樹芳草鮮美落英繽紛",
      "漁人甚異之復前行欲窮其林",
      "林盡水源便得一山山有小口",
      "彷彿若有光便捨船從口入",
      "初極狹才通人復行數十步",
      "豁然開朗土地平曠屋舍儼然",
      "有良田美池桑竹之屬",
      "阡陌交通雞犬相聞",
      "其中往來種作男女衣著悉如外人",
      "黃髮垂髫並怡然自樂",
      "見漁人乃大驚問所從來具答之",
      "便要還家設酒殺雞作食",
      "村中聞有此人咸來問訊",
      "自云先世避秦時亂率妻子邑人",
      "來此絕境不復出焉遂與外人間隔",
      "問今是何世乃不知有漢無論魏晉",
      "此人一一為具言所聞皆嘆惋",
      "餘人各復延至其家皆出酒食",
      "停數日辭去此中人語云不足為外人道也",
      "既出得其船便扶向路處處誌之",
      "及郡下詣太守說如此",
      "太守即遣人隨其往尋向所誌遂迷不復得路",
      "南陽劉子驥高尚士也聞之欣然規往",
      "未果尋病終後遂無問津者"
    ];
  } else if (id === 'guiyuantianju') {
    manualChunks = [
      "少無適俗韻性本愛丘山",
      "誤落塵網中一去三十年",
      "羈鳥戀舊林池魚思故淵",
      "開荒南野際守拙歸園田",
      "方宅十餘畝草屋八九間",
      "榆柳蔭後簷桃李羅堂前",
      "曖曖遠人村依依墟里煙",
      "狗吠深巷中雞鳴桑樹顛",
      "戶庭無塵雜虛室有餘閒",
      "久在樊籠中復得返自然"
    ];
  }

  return {
    id,
    title,
    author,
    content: cleanText,
    chunks: manualChunks
  };
};

export const POEMS: Poem[] = [
  processPoem("兵車行", "杜甫", "bingchexing", ""),
  processPoem("桃花源記", "陶淵明", "taohuayuanji", ""),
  processPoem("歸園田居 (其一)", "陶淵明", "guiyuantianju", "")
];
