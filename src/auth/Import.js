import { db } from "./Firebase.js";
import { collection, addDoc } from "firebase/firestore";

const members = [
  { id: "559623317", nama: "Zallscy" },
  { id: "502268090", nama: "Bara" },
  { id: "1678981799", nama: "Reyy" },
  { id: "4819371212", nama: "Rodoks" },
  { id: "7164213730", nama: "Elgnlrt" },
  { id: "2359823475", nama: "Opet" },
  { id: "97336096", nama: "Salsa" },
  { id: "892551399", nama: "Amz" },
  { id: "1001642422", nama: "Otoyy" },
  { id: "1587183269", nama: "Zeno" },
  { id: "621236152", nama: "Skyy" },
  { id: "2274294495", nama: "BYY" },
  { id: "2255749303", nama: "ANGGA" },
  { id: "2068294852", nama: "MALL" },
  { id: "548727905", nama: "VIBOYTAK" },
  { id: "1586075705", nama: "KY' Moy" },
  { id: "1831813047", nama: "Ichihot" },
  { id: "1629616143", nama: "Seraa" },
  { id: "7419948521", nama: "RAA" },
  { id: "2226910034", nama: "BbyzZ" },
  { id: "9204415752", nama: "Titen" },
  { id: "556334457", nama: "MAS IQBAL" },
  { id: "766797534", nama: "Adi" },
  { id: "8615585464", nama: "Luvi" },
  { id: "7442092702", nama: "ASEP" },
  { id: "6652241355", nama: "Jacky" },
  { id: "6615323818", nama: "RARA" },
  { id: "1075256229", nama: "Saa" },
  { id: "1707683856", nama: "Selzz" },
  { id: "909222621", nama: "SAxLA" },
  { id: "2263167999", nama: "Quen" },
  { id: "1247444317", nama: "Alz" },
  { id: "565223068", nama: "Ndoo" },
  { id: "1593638187", nama: "Axo mr.yan" },
  { id: "2491625006", nama: "Fikk" },
  { id: "1486000882", nama: "Yanz" },
  { id: "979739652", nama: "Amoy'ky" },
  { id: "7960480101", nama: "RISKI" },
  { id: "1683427734", nama: "Tr chiro" },
  { id: "737665293", nama: "Zioo" },
  { id: "9576651384", nama: "call" },
  { id: "287154000", nama: "Ney" },
  { id: "721096032", nama: "VIRxZAA" },
  { id: "782378910", nama: "JOKY" },
  { id: "116805745", nama: "ZAAxVIR" },
];

const addMembers = async () => {
  try {
    for (let member of members) {
      await addDoc(collection(db, "member"), {
        id: member.id,
        nama: member.nama,
        createdAt: new Date(),
      });
      console.log(`Berhasil menambahkan: ${member.nama} (${member.id})`);
    }
    console.log("Semua member berhasil ditambahkan!");
  } catch (error) {
    console.error("Error menambahkan member:", error);
  }
};

addMembers();
