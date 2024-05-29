// Components
import FilterPage from '../screens/jobs/FilterPage';
import SlamshutPage from '../screens/jobs/SlamshutPage';
import RegulatorPage from '../screens/jobs/RegulatorPage';
import WaferCheckPage from '../screens/jobs/WaferCheckPage';
import ChatterBoxPage from '../screens/jobs/ChatterBoxPage';
import MeterDetailsPage from '../screens/jobs/MeterDetailsPage';
import GenericPhotoPage from '../screens/jobs/GenericPhotoPage';
import ActiveRegulatorPage from '../screens/jobs/ActiveRegulatorPage';
import ReliefRegulatorPage from '../screens/jobs/ReliefRegulatorPage';
import CorrectorDetailsPage from '../screens/jobs/CorrectorDetailsPage';
import DataLoggerDetailsPage from '../screens/jobs/DataLoggerDetailsPage';
import AssetTypeSelectionPage from '../screens/jobs/AssetTypeSelectionPage';
import AdditionalMaterialPage from '../screens/jobs/AdditionalMaterialPage';
import StreamsSetSealDetailsPage from '../screens/jobs/StreamsSetSealDetailsPage';
import MaintenanceQuestionsPage from '../screens/maintenance/MaintenanceQuestionsPage';
import KioskPage from '../screens/survey/KioskPage';
import VentsDetailsPage from '../screens/survey/VentsPage';
import MovDetailsPage from '../screens/survey/MovPage';
import EcvDetailsPage from '../screens/survey/EcvPage';

export const unitedFlowNavigators = [
  {
    name: 'AssetTypeSelectionPage',
    component: AssetTypeSelectionPage,
    initialParams: {
      title: 'Assets being installed',
    },
  },
  {
    name: 'MeterDetails',
    component: MeterDetailsPage,
    initialParams: { title: 'New Meter Details' },
  },
  {
    name: 'EcvPhoto',
    component: GenericPhotoPage,
    initialParams: {
      title: 'New ECV to MOV',
      photoKey: 'NewEcvToMov',
    },
  },
  {
    name: 'ExistingEcvPhoto',
    component: GenericPhotoPage,
    initialParams: {
      title: 'Existing ECV to MOV',
      photoKey: 'ExistingEcvToMov',
    },
  },
  {
    name: 'MeterDataBadge',
    component: GenericPhotoPage,
    initialParams: {
      title: 'New Meter data badge',
      photoKey: 'MeterDataBadge',
    },
  },
  {
    name: 'MeterIndex',
    component: GenericPhotoPage,
    initialParams: {
      title: 'New Meter index',
      photoKey: 'MeterIndex',
    },
  },
  {
    name: 'MeterPhoto',
    component: GenericPhotoPage,
    initialParams: {
      title: 'New Meter photo',
      photoKey: 'NewMeterPhoto',
    },
  },
  {
    name: 'CorrectorDetails',
    component: CorrectorDetailsPage,
    initialParams: {
      title: 'New Corrector installed',
      photoKey: 'installedCorrector',
    },
  },
  {
    name: 'DataLoggerDetails',
    component: DataLoggerDetailsPage,
    initialParams: {
      title: 'New AMR installed',
      photoKey: 'installedAMR',
    },
  },
  {
    name: 'StreamsSetSealDetails',
    component: StreamsSetSealDetailsPage,
    initialParams: {
      title: 'Streams Set Seal Details',
    },
  },
  {
    name: 'StreamFilterPage',
    component: FilterPage,
    initialParams: { title: 'Filter' },
  },
  {
    name: 'StreamSlamshutPage',
    component: SlamshutPage,
    initialParams: { title: 'Slamshut' },
  },
  {
    name: 'StreamActiveRegulatorPage',
    component: ActiveRegulatorPage,
    initialParams: {
      title: 'Active Regulator',
    },
  },
  {
    name: 'StreamReliefRegulatorPage',
    component: ReliefRegulatorPage,
    initialParams: { title: 'Relief Regulator' },
  },
  {
    name: 'StreamWaferCheckPage',
    component: WaferCheckPage,
    initialParams: { title: 'Wafer Check' },
  },
  { name: 'Regulator', component: RegulatorPage },
  {
    name: 'RegulatorPhotoPage',
    component: GenericPhotoPage,
    initialParams: {
      title: 'New Regulator photo',
      photoKey: 'RegulatorPhotoPage',
    },
  },
  { name: 'ChatterBox', component: ChatterBoxPage },
  { name: 'AdditionalMaterial', component: AdditionalMaterialPage },
  { name: 'MaintenanceQuestions', component: MaintenanceQuestionsPage },
  {
    name:'KioskPage',component: KioskPage},
    {name: 'VentsPage', component: VentsDetailsPage},
    {name: 'MovPage', component: MovDetailsPage},
    {name: 'EcvPage', component: EcvDetailsPage},

{
    name: 'SiteDrawingPhoto',
    component: GenericPhotoPage,
    initialParams: {
      title: 'Site Survey Drawing ',
      photoKey: 'siteDrawing',
    },
  },
  
];
