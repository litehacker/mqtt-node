import axios from "axios";
import { connect } from "mqtt"; // import connect from mqtt
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
let valibleVersion = 0x00000002;
const client = connect("mqtt://" + process.env.MQTT_BROKER_URL); // create a client
const _topicRead = process.env.TOPICTOREAD;
const _topicPub = process.env.TOPICTOPUBLISH;
const frimwere = [
  "200050000800E9C10800E7F90800E7FF0800E8070800E80D0800E813000000000000000000000000000000000800E8190800E825000000000800E8310800E83D0800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800EA090800E8490800EA090800EA090800EA090800EA090800EA0900000000000000000000000000000000000000000000000000000000F108F85F4C05B510B9337823B1134B04F3AF480423018000BD107023200001EC0000000008011EDC4B03B5084903B11BF3AF4803BD08800000000000200001F008011EDCF81346032A002B011A18D1FB47703801B082B5804603AF0071FB460A71BB4613FCF4F00020014943FD4EF00079BB79FA46184611FD00F000F0002001493EFD6EF000200279BBFD41B2DB3301461179FAF00046182002FCF1FD5FF00020034937FD32F000330279BB79FAB2DB46184611FCE2F000F000200379BBFD50B2DB3303461179FAF00046182001FCD7FD45F0002005492B",
  "FD18F000330479BB79FAB2DB46184611FCC8F000F00020054925FD36F000200679BBFD09B2DB3305461179FAF00046182006FCB9FD27F0002007491EFCFAF000330679BB79FAB2DB46184611FCAAF000F00020074918FD18F000200879BBFCEBB2DB3307461179FAF00046182008FC9BFD09F00020044911FCDCF000330879BB79FAB2DB46184611FC8CF000F0002004480BFCFAFD04F0003708BF00BD8046BD200000402000002020000070200000782000006020000080200000382000002808011EF4B082B5804603AF0071FB460A71BB4613FC50F0002001494EFCAAF00079BB79FA46184611FC5CF000F00020014949FCCAF000200279BBFC9DB2DB3301461179FAF00046182002FC4DFCBBF00020034942FC8EF000330279BB79FAB2DB46184611FC3EF000F0002003493CFCACF000200479BBFC7FB2DB3303461179FAF00046182004FC2FFC9DF00020054935FC70F000330579BB79FAB2DB46184611FC20F000F000200579BBFC8EB2DB3306461179FAF00046182004FC15FC83F00020064929FC56F000330779BB79FAB2DB46184611FC06F000F000200679BBFC74B2DB3308461179FAF00046182004FBFBFC69F0002007491DFC3CF000330979BB79FAB2DB46184611FBECF000F00020074917FC5AF000200879BBFC2DB2DB330A",
  "461179FAF00046182008FBDDFC4BF000330B79BB79FAB2DB46184611FBD2F000F0002004480BFC40FC4AF0003708BF00BD8046BD200000082000001020000070200000282000003820000078200000602000004008011EF4B082B5804603AF0071FB460A71BB4613FB96F00020014948FBF0F00079BB79FA46184611FBA2F000F00020014943FC10F000200279BBFBE3B2DB3301461179FAF00046182002FB93FC01F0002003493CFBD4F000330279BB79FAB2DB46184611FB84F000F000200379BBFBF2B2DB3303461179FAF00046182002FB79FBE7F00020044930FBBAF000330479BB79FAB2DB46184611FB6AF000F0002004492AFBD8F000200579BBFBABB2DB3305461179FAF00046182005FB5BFBC9F00020064923FB9CF000330679BB79FAB2DB46184611FB4CF000F000200679BBFBBAB2DB3308461179FAF00046182002FB41FBAFF00020074917FB82F000330979BB79FAB2DB46184611FB32F000F000200779BBFBA0B2DB330A461179FAF00046182002FB27FB95F000F0002002480AFB92FB9CF0003708BF00BD8046BD2000003820000028200000482000000020000008200000402000007808011EF4B082B5804603AF0071FB460A71BB4613FAEAF00020014959FB44F00079BB79FA46184611FAF6F000F00020014954FB64",
  "F000200279BBFB37B2DB3301461179FAF00046182002FAE7FB55F0002003494DFB28F000330279BB79FAB2DB46184611FAD8F000F00020034947FB46F000200479BBFB19B2DB3303461179FAF00046182004FAC9FB37F00020054940FB0AF000330479BB79FAB2DB46184611FABAF000F0002005493AFB28F000200679BBFAFBB2DB3305461179FAF00046182006FAABFB19F00020074933FAECF000330779BB79FAB2DB46184611FA9CF000F000200779BBFB0AB2DB3308461179FAF00046182003FA91FAFFF00020084927FAD2F000330979BB79FAB2DB46184611FA82F000F000200879BBFAF0B2DB330A461179FAF00046182003FA77FAE5F000330B79BB79FAB2DB46184611FA6CF000F000200679BBFADAB2DB330C461179FAF00046182002FA61FACFF000330279BB79FBB2DAB2DB330146104619FA54F000F000480BBF00FACF46BD3708BF00BD80200000682000004020000028200000182000008020000060200000382000007808011EFCB082B5804603AF0071FB460A71BB4613FA1AF0002001493AFA74F00079BB79FA46184611FA26F000F00020014935FA94F000200279BBFA67B2DB3301461179FAF00046182002FA17FA85F0002003492EFA58F000330279BB79FAB2DB46184611FA08F000F00020034928FA76F0002004",
  "79BBFA49B2DB3303461179FAF00046182004F9F9FA67F00020054921FA3AF000330479BB79FAB2DB46184611F9EAF000F0002005491BFA58F000200679BBFA2BB2DB3305461179FAF00046182006F9DBFA49F00020074914FA1CF000330679BB79FAB2DB46184611F9CCF000F000200779BBFA3AB2DB3307461179FAF0004618480AF9C1FA3CF0003708BF00BD8046BD2000003020000080200000502000001820000058200000682000002808011EF4B082B5804603AF0071FB460A71BB4613F98AF0002001493AF9E4F00079BB79FA46184611F996F000F00020014935FA04F000200279BBF9D7B2DB3301461179FAF00046182002F987F9F5F0002003492EF9C8F000330279BB79FAB2DB46184611F978F000F00020034928F9E6F000200479BBF9B9B2DB3303461179FAF00046182004F969F9D7F000330479BB79FAB2DB46184611F95EF000F000200279BBF9CCB2DB3305461179FAF00046182001F953F9C1F00020054916F994F000330679BB79FAB2DB46184611F944F000F00020054910F9B2F000200679BBF985B2DB3307461179FAF00046182006F935F9A3F000F0004809BF00F9AD46BD3708BF00BD8020000018200000282000004020000050200000802000006008011EF4B082B5804603AF0071FB460A71BB4613F8FCF000",
  "20014934F956F00079BB79FA46184611F908F000F0002001492FF976F000200279BBF949B2DB3301461179FAF00046182002F8F9F967F00020034928F93AF000330279BB79FAB2DB46184611F8EAF000F00020032002F958F955F000330379BB79FAB2DB46184611F8DCF0002005491CF920F000330479BB79FAB2DB46184611F8D0F000F00020054916F93EF000200679BBF911B2DB3305461179FAF00046182006F8C1F92FF0002007490FF902F000330679BB79FAB2DB46184611F8B2F000F00020074809F920F92AF0003708BF00BD8046BD20000038200000282000004820000000200000082000004008011F08B082B5804603AF004A3871FB701379FB22084B374B37701A701A2200781B4B33D9072B01781B4B330308F0434B31B2DAE006701A781B4B2F0304F0434B2DB2DAF000701A2032F993F81AF002781B4B28F0004618F44FF951F002707A2030F811F938F0001094F241F9A8F000F0002030F241F931F00010942030F9A1F92AF0001094F241F99AF000F00020202064F923F994F000781B4B170320F0434618B2DBF8DBF00022044B14F000701AF000F8754B12F82B701A2202781B4B100304F0434618B2DBF8C9F0001094F241F976F0002000490BF876F0002001490AF872F000F81DF0003708BF00BD8046BD2000020B",
  "2000020C20000208200002092000020A2000008820000090AF00B580F0002001F44FF8A4F00060FABF00F951B580BD802002AF00F899F00060FAF44FF946F000BD80BF00B087B5904603AF0071FB460A71BB4613F1074B12CB0F0408000FE884781B4B10429A79BA4B0ED3033B01781B79BB71BB3318009BF853443BB2DA3C10441379FBB25BB2DB037FF063B2DBB25BF0004618BF00F86A46BD371CBF00BD9008011F0C2000020BAF00B580781B4B080304F0434B06B2DA4B05701AF043781BB2DB0308F0004618BF00F850BF00BD8020000209B084B5804603AF0071FB6039F00379FB71FB030700DB79FBF043B25BB25B03404618B2DBF837F00060FB230068FBE0094413683A4618781BF83BF000330168FB68FB60FBDDF22B07BF00BF0046BD3710B580BD80AF00B08271FB4603461879FBF827F0003708BF00BD8046BDB082B5806078AF00687BE006607A1C5A4618781BF817F000781B687BD1F42B00BF00BF0046BD3708B580BD80AF00B08271FB4603210079FBF0004618BF00F81246BD3708B580BD80AF00B08271FB4603210179FBF0004618BF00F80446BD3708B580BD80AF00B084460A4603461371FB79FB71BB030FF02379FB73FB73BB011B79BB7BFAB2DB4313F00046187BBAF80B431379BB4618B2DBF804F0003710BF00",
  "BD8046BDB082B5804603AF0079FB71FBF000461879FBF809F0004618BF00F82146BD37080000BD80B086B5804603AF024B0971FB79FB781AB2DB4313F10773FB230A020F230193004804214EFBA6F0023710BF00BD8046BD2000020C20000424B082B5804603AF0079FB71FB0304F0434618B2DBFFD8F7FFF000201479FBF8370304F0234618B2DBFFCEF7FFF0002014BF00F82D46BD37080000BD80AF00B48068DB4B10F0234A0F60D3738068DB4B0DF0434A0C60D37380681B4B0BF0234A0A60130301681B4B08F0434A076013030122004B05BF00605ABF00BF0046BDBF004770BC80E000EDF0E0001000B087B4806078AF00681B4B0DFBA24A0D0C9A2303FB02687B617BF303685B4B0A4B09613B693B685A60FB1AD3697A68FBD8F6429ABF00BF0046BD371C4770BC802000017C431BDE83E0001000B082B5806078AF00681B4B11DD022B7B22004B0F4B0E601A4A0E681B2B215CD34B0BD00E3301681B60134A09681B4B0844134A0846192201F0034807E002FE8022014B06BF00701A46BD3708BF00BD802000042020000320200004D02000021CB086B5806078AF0023056039E008617B687A697B781B4413D0072B3C3301697B697A617B429A683BE000DBF2697BBF00687A3301781B4413697B733B687A3302781B4413697B737B",
  "687A3303781B4413F10773BB4618030CFA9AF004693B613837184618BD8046BDB088B58060F8AF00607A60B961FB230569FBE008441368FA2B3C781B69FBD00761FB330168BB69FADBF2429ABF00E00061BB69FB69BBE008441368FA2B2C781B69BBD00761BB330168BB69BADBF2429ABF00E000617B69BB697BE008441368FA2B21781B697BD007617B330168BB697ADBF2429ABF00E000330169BB18D168FA69BB697A3B011AD36878461AFAB0F0043720BF00BD8046BDAF00B58021002280F00448254824FA7DFC70F000F7FF48232280FE5748202100FA72F004F000481E481EFCA1FE4CF7FF21002280F004481A4819FA67FCD0F000F7FF48182280FE4148152100FA5CF004F00048134814FD0BFE36F7FF21002280F004480F480EFA51FD46F000F7FF480E2280FE2B480A2100FA46F004F00048084808FD81FE20F7FF21002280F0044804F44FFA3BF00170FABF00FD3FBF00BD802000032008011F4C08011F50B096B580F001AF00F000FCCFF000FA59F000FB55F000FA9BF000FAC7F000FAFB2002FB23FCE2F7FF20002103F864F7FF20002101FD74F7FF657B2300F7FFE0046D7BFF89657B33012B016D7BF001DDF72001F872FA1AF001F00120012001FA17FA14F001F887230020193053FD4AF0002219233248B349B2FC27F003",
  "737AF44F49B1227DF00348AF48AFFCB2F82CF7FF643B460348AC6C39FEDCF7FF6BFB63F8D0012BC8FE1DF001681B4BA844134AA846192201F00348A3F001FD3C4603FCCD60134AA420002102FA20F7FF3053F897D1172B01FCC0F0016CFB4602F6441AD34293621F2104D90EF7FF2000F640FADFF00130B82102FCBBF7FF20002300FA073053F887FCA8F0014B9246021AD3681B42934A91F897D91D2B0030534B8FD1194B8F681A429A681BF001DB012019FDDAFCE8F0002219233248824981FBC5F003FC8AF0014A8346034B8560134A83681B4B8460132B00781B8138F000681B4B7B487B4619FE76F7FF6BBB63B87F96F5B380FAF280F5B36BBBDC067F912BC86BBB6BBBD01ED0212BC96BBBE0EE1323F2A3F2002B08A20180E9F023F8520800D2AD0800D3CD0800D26F0800D3CD0800D3CD0800D2EB0800D3290800D3CD0800D367681B4B674A663301E0E56013FB14F001681B4B5E46191D3AF7FF485D2100FE6FF7FF20001D3BFB81F7FF4618F001FD17F44FFB33F00160FA2102FC39F7FF20002300F9853053F8874B50E0C61D3A681B484F4619FE52F7FFFC6CF7FF20002100FC7EF7FF20002100F80AF7FFFB26F001707AF44FFC1AF00120002102F966F7FFF8872300E0A73053681B4B4046191D3AF7FF483FF7FFFE332100FC4D",
  "F7FF20002100FC5FF7FF2000F001F8A5F44FFB07F001707A2102FBFBF7FF20002300F9473053F8874B31E0881D3A681B48304619FE14F7FFFC2EF7FF20002100FC40F7FF46181D3BFCBAF7FFFAE8F00130B8F640FBDCF00120002102F928F7FFF8872300E0693053681B4B2146191D3AF7FF4820F7FFFDF52100FC0FF7FF20001D3BFC21F7FF4618F001FC9BF640FAC9F00130B82102FBBDF7FF20002300F9093053F8874B12E04A1D3A681B48114619FDD6F7FFFBF0F7FF20002100FC02F7FF46181D3BFC7CF7FFFAAAF00130B8F640FB9EF00120002102F8EAF7FFF8872300E02B30532000009C200004D0200003A0200004202000032020000210000493DF20000214200000982000021C21002280F004484E1D3BF87521002232F00446184B4BF86F701A220022004B4A2102601AF7FF20002300F8BD3053F88721002280F00448421D3BF85D21002232F00446184B3FF857701A220022004B3E4B3D601A4A3A681B22014413483B4619FBB3F003F000483A4603FEF33037F8873037F897F47F2B01F897AE752B003053AE70F47FF88723002300304B304AF887F7FE482F4603FE754B2E461A2300601AE013647B6C7B4A2A781B4413D0052B7B6C7B4A27781B4413D1042B7D304BF897F88733016C7B304B647B3301681B4B216C7A3304",
  "DDE5429A304BF897D0072B04F887230122FF304A48192100F802F004304AF897F47F2B00F001AE352103FA2DF7FF20004B13F9AF4618681BFB46F000F00120324B0FFAF7B29A681B490C2364F003480A22FFFA1E48092100FFE2F003F8872301F00130534603FADBE61164FB200003202000021C20000420200004D02000022020000218B090B580F107AF002228031846182100FFC4F00322001D3B605A601A60DA609A2301611AF44F61BB61FB3380623B230062BB2301637B23023380F44FF44F63BB63FB13E00318F107F00246184603FAABD0012B00F954F000607B230F60BB230260FB23006380F44F2300613B1D3B617B46182102FD18F0022B004603F000D001BF00F93F46BD37400000BD80AF00B5804A134B124B11601A605A4A1222004B0F4B0E609A60DA2200F44F4B0C611A428022004B0A4B09615A619A220022004B074B0661DA621A2200F00148044603FE21D0012B00F914F000BD80BF002000042440005400000186A0AF00B5804A184B174B16601A7282F44F4B14605A609A220022004B124B1160DA611A220022004B0F4B0E615A7200F44F4B0C619A61DA221822004B0A4B09621A625A220022004B074B06629A62DA220AF00248044603FE4DD0012B00F8DCF000BD80BF002000047840013000AF00B5804A124B11",
  "4B10601A32E1F44F4B0E605A609A220022004B0C4B0B60DA611A2200220C4B094B08615A619A220022004B06480561DAF8F0F0032B004603F000D001BF00F8B3BF00BD80200004D040013800AF00B5804A124B114B10601A32E1F44F4B0E605A609A220022004B0C4B0B60DA611A2200220C4B094B08615A619A220022004B06480561DAF8C6F0032B004603F000D001BF00F889BF00BD802000051440004400B088B580F107AF0022000310605A601A60DA609A699B4B37F0434A3661930310699B4B340310F00368FB60FB699B4B31F0434A3061930320699B4B2E0320F00368BB60BB699B4B2BF0434A2A61930304699B4B280304F003687B607B699B4B25F0434A2461930308699B4B220308F003683B603BF44F2200481F5100FD18F00121102200F001481D2200FD13481C2103FD0EF0015300F44F2301613B2300617B230261BBF10761FB46190310F00148122310FB7B2301613B2300617B230261BBF10761FB46190310F001480C2303FB6D2301613B2300617B230261BBF10761FB46190310F0014806BF00FB5F46BD3720BF00BD8040021000400110004001080040010C00AF00B480BF00B672B580E7FEAF00B08460396078F7FE68784603FC876838737BFC82F7FE733B460373FB23002300E021E00F73BB7BBB7BFA461A4413",
  "4413687B7BBB781A440B6839429A781B7BBBD10773BB33017B3B7BBAD3EB429ABF00E0007B3B7BBAD101429AE009230133017BFB7BFA73FB7B3B7B79429A1ACB2300DDD737104618BD8046BDB084B5806078AF0073FB2300F900F00160BB460323C8E02049142205F0034814F44FF830220673FA48116879F8BBF00368784910FFA5F7FF73FB46032B007BFBF001D10E4602F8E51AD368BB720FF242D9014293FA21F0012B007BFBE000D0DBBF00BF0046BD3710BF00BD80200000B8200004D008011F6CB084B5806078AF0073FB2300F8C4F00160BB460323C8E01F4913220BF00248132364FFF46879222DF00348104910F880F7FF68784603FF6A7BFB73FBD10E2B00F8AAF00168BB4602F2421AD34293720FF001D9017BFBF9E6D0DC2B00BF00E0003710BF00BD8046BD200000C0200004D008011F70B084B5806078AF0073FB2300F88AF00160BB46032364E0284918221EF00248182364FFBA6879220AF00348154915F846F7FF68784603FF307BFB73FBD1052B0068784911FF27F7FF73FB46032B007BFBF001D10E4602F8671AD368BB720FF242D9014293F9A3F0012B007BFBE000D0D3BF00BF0046BD3710BF00BD80200000CC200004D008011F6C08011F78B084B5806078AF0073FB2300F844F00160BB46032364E02949182223",
  "F0024818F44FFF742215637A48156879FFFFF00268784914FEE9F7FF73FB46032B007BFB4911D105F7FF68784603FEE07BFB73FBD10E2B00F820F00168BB4602F2421AD34293720FF001D9017BFBF95CD0D22B00BF00E0003710BF00BD8046BD200000EC200004D008011F8008011F90B084B5806078AF0073FB2300FFFEF00060BB46032364E02949182211F0024818F44FFF2E2209637A48156879FFB9F00268784914FEA3F7FF73FB46032B007BFB4911D105F7FF68784603FE9A7BFB73FBD10E2B00FFDAF00068BB4602F2421AD34293720FF001D9017BFBF916D0D22B00BF00E0003710BF00BD8046BD20000110200004D008011FA008011F78B082B5806078AF002226236448064905FEEFF00270FAF44FFFBCF0003708BF00BD8046BD20000124200004D0B082B5806078AF004908687AF00348082364FCAB4906222EF0024806201EFED4FFA2F0003708BF00BD8046BD08011FA82000014C200004D0B086B5804603AF0279FB71FBF107733BF1070208230A010C23019300F00248037A3BFC2137104618BD8046BD20000478B082B5804603AF0071FB460A71BB461321102200F001480979FBFAF3F7FF461879BBFFD7F7FF46182201FFD348032110FAE6F0013708BF00BD8046BD40010800B084B5804603AF00220071FB480B2110",
  "FAD6F001461879FBFFBAF7FFF7FF20004603FFB7220173FB48042110FAC8F00146187BFB46BD3710BF00BD8040010800B082B5804603AF0071FB460A71BB4613005B79FBF003B2DB71FB037E79FB79BA46184611FFACF7FF3708BF00BD8046BDB084B5804603AF0079FB71FBB25B005B037EF003F063B25BB25B037F79FB71FBF7FF46184603FFB57BFB73FB37104618BD8046BDB082B5804603AF0071FB460A71BB4613461879FBFFDAF7FF461A4603431379BB79FBB2DA46184611FFB8F7FF3708BF00BD8046BDB082B5804603AF0071FB460A71BB4613461879FBFFC0F7FFB25A46033006F997B25B43DBB25B401379FBB2DA46184611FF9AF7FF3708BF00BD8046BDB086B5804603AF0271FB6039200D2107FF8CF7FF79FA683BF107701A9300030C2201683B200C6839F80FF00073FB46032B007BFB89BBD102D0012B1073FB230246187BFB46BD3710B590BD80AF00B087607B60B973FB460373BB461375FB230275BB2300757B23002B0C7BFB2B0ED0062312D109231075BBE005757B75BB2377757B2330BF00E000F0637DBBB2DB037F20024619FF4AF7FF20042180FF92F7FF200A2180FF74F7FF20012100FF3EF7FF827B23008A7BE00A441368BA4619781BF7FF20098A7BFF33827B3301B29B7BBB429A8A7A7BFBD3EF20014619",
  "FF26F7FF2B0C7BFB2180D103F7FF200DF44FFF51827B63FAF7FF20044603FF318A7B753B827B3B012B008A7B7D3BD00A0301F003D1052B007D7B7D3AB2DB4013D0E92B00200D2180FF4EF7FF2B008A7B2006D057FF14F7FFF00346032B00031B2300D14D7D3A75FB40137DBBF003B2DB2B0003012301D0017BFB75FBD1402B0CF7FF200A4603FEFD200C753BFEF8F7FFF0034603747B03072B007C7B7D3BD00BB29B3B01B29A00DBB29B7C7BB29A4413801A6ABB7D3BE00500DBB29B6ABBB29A7D3B801AD1012B00753B23012B107D3B2310D9012300753BE00A827B687A8A7B200918D4FECCF7FF7023460333018A7B7D3B827B8A7AB29BD3EF429A2302E0017DFB75FB371C4618BD9046BDB086B5806078AF02737B2300200D2100FE98F7FF2293687B687B701A22203301F107701A9300030A2202687B200C6879FF17F7FF73FB46032B007BFB2300D118E00973BB687A7BBB781A441340537B7B7BBB737B73BB33012B037BBB7BBBD9F24413687A7B7A781BD001429A73FB230246187BFB46BD3710B590BD80AF00B087460B60F872FB607A20052104FEA6F7FF200A2180FE88F7FF75FB23007DFBE00A441368FA4619781BF7FF20097DFBFE4B75FB33017AFB7DFAD3F0429A20012103FE40F7FF75FB23FFF7FF20054603FE537DFB75BB",
  "75FB3B012B007DFB7DBBD0040304F003D0EF2B00F7FF20224603FE43687B4FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
];
if (!_topicRead) {
  throw new Error("No env file");
}
if (!_topicPub) {
  throw new Error("No env file");
}
const debug = async (data: any[]) => {
  for (let i = 0; i < data.length; i++) {
    // Wrap the MQTT logic in a Promise
    const responsePromise = new Promise((resolve) => {
      // Subscribe to the response topic
      client.subscribe(_topicRead);

      // Listen for the response
      client.on("message", function (topic, message) {
        if (topic === _topicRead) {
          const response = message.toString("utf-8");
          // Resolve the Promise with the response
          resolve(response);
        }
      });
    });

    // Publish the message
    client.publish(_topicPub, data[i]);

    // Wait for the response
    const response = await responsePromise;

    // Process the response
    console.log("Received response:", response);
    // Perform further actions with the response
    console.log(data[i]);
  }
};

client.on("connect", function () {
  client.subscribe(_topicRead, function (err) {
    if (!err) {
      console.log("connected,_topicRead:", _topicRead, "_topicPub:", _topicPub);
    }
  });
});

client.on("message", function (topic, message) {
  // {"operationType":"check"}

  // {
  //   "operationType":"payment",
  //   "content":{
  //     "cardID"
  //   }
  // }
  try {
    let time = new Date().getTime();
    const data: {
      operationType: "check" | "payment" | "update";
      content: any;
    } = JSON.parse(message.toString("utf-8"));
    if (data.operationType === "check") {
      const Version = data.content.version.toString(16);
      if (Version < valibleVersion) {
        debug(frimwere);
        console.log("new version avalible");
        console.log(Version);
      } else {
        if (_topicPub) {
          console.log("<200, good!");
          client.publish(_topicPub, "<200, good!");
        }
      }
    } else if (
      data.operationType === "payment" &&
      data.content &&
      topic === _topicRead
    ) {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process.env.FIREBASE_URL,
        headers: {
          "Content-Type": "text/plain",
        },
        data: data.content,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(
            JSON.stringify(response.status),
            new Date().getTime() - time,
            JSON.stringify(response.data)
          );
          if (_topicPub) {
            client.publish(
              _topicPub,
              "<" +
                JSON.stringify(response.status) +
                "," +
                JSON.stringify(response.data) +
                "!"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (data.operationType === "update") {
      console.log(data.content.status);
    }
    //client.end();
  } catch (e) {
    console.log(e);
  }
});
