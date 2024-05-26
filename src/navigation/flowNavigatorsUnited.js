// Components
import FilterPage from '../screens/jobs/FilterPage';
import SlamshutPage from '../screens/jobs/SlamshutPage';
import RegulatorPage from '../screens/jobs/RegulatorPage';
import WaferCheckPage from '../screens/jobs/WaferCheckPage';
import ChatterBoxPage from '../screens/jobs/ChatterBoxPage';
import MeterDetailsPage from '../screens/jobs/MeterDetailsPage';
import GenericPhotoPage from '../screens/jobs/GenericPhotoPage';
import MeterGatewayScreen from '../screens/gateways/MeterGateWay';
import CorrectorGateway from '../screens/gateways/CorrectorGateWay';
import ActiveRegulatorPage from '../screens/jobs/ActiveRegulatorPage';
import ReliefRegulatorPage from '../screens/jobs/ReliefRegulatorPage';
import CorrectorDetailsPage from '../screens/jobs/CorrectorDetailsPage';
import DataLoggerDetailsPage from '../screens/jobs/DataLoggerDetailsPage';
import AssetTypeSelectionPage from '../screens/jobs/AssetTypeSelectionPage';
import DataloggerGatewayScreen from '../screens/gateways/DataloggerGateWay';
import AdditionalMaterialPage from '../screens/jobs/AdditionalMaterialPage';
import AssetSelectGatewayScreen from '../screens/gateways/AssetSelectGateWay';
import StreamsSetSealDetailsPage from '../screens/jobs/StreamsSetSealDetailsPage';
import MaintenanceQuestionsPage from '../screens/maintenance/MaintenanceQuestionsPage';

export const unitedFlowNavigators = [
  {
    name: 'AssetTypeSelectionPage',
    component: AssetTypeSelectionPage,
    initialParams: {
      title: 'Assets being installed',
      nextScreen: 'AssetSelectGateway',
    },
  },
  {
    name: 'AssetSelectGateway',
    component: AssetSelectGatewayScreen,
    initialParams: { pageFlow: 1 },
  },
  {
    name: 'MeterDetails',
    component: MeterDetailsPage,
    initialParams: { title: 'New Meter Details', nextScreen: 'NewEcvToMov' },
  },
  {
    name: 'NewEcvToMov',
    component: GenericPhotoPage,
    initialParams: {
      title: 'New ECV to MOV',
      photoKey: 'NewEcvToMov',
      nextScreen: 'MeterGatewayScreen1',
    },
  },
  {
    name: 'MeterGatewayScreen1',
    component: MeterGatewayScreen,
    initialParams: { pageflow: 1 },
  },
  {
    name: 'MeterDataBadge',
    component: GenericPhotoPage,
    initialParams: {
      title: 'New Meter data badge',
      photoKey: 'MeterDataBadge',
      nextScreen: 'MeterIndex',
    },
  },
  {
    name: 'MeterIndex',
    component: GenericPhotoPage,
    initialParams: {
      title: 'New Meter index',
      photoKey: 'MeterIndex',
      nextScreen: 'NewMeterPhoto',
    },
  },
  {
    name: 'NewMeterPhoto',
    component: GenericPhotoPage,
    initialParams: {
      title: 'New Meter photo',
      photoKey: 'NewMeterPhoto',
      nextScreen: 'MeterGatewayScreen2',
    },
  },
  {
    name: 'MeterGatewayScreen2',
    component: MeterGatewayScreen,
    initialParams: { pageflow: 2 },
  },
  {
    name: 'CorrectorDetails',
    component: CorrectorDetailsPage,
    initialParams: {
      title: 'New Corrector installed',
      nextScreen: 'CorrectorGateway',
      photoKey: 'installedCorrector',
    },
  },
  { name: 'CorrectorGateway', component: CorrectorGateway },
  {
    name: 'DataLoggerDetails',
    component: DataLoggerDetailsPage,
    initialParams: {
      title: 'New AMR installed',
      nextScreen: 'DataLoggerGateway',
      photoKey: 'installedAMR',
    },
  },
  { name: 'DataLoggerGateway', component: DataloggerGatewayScreen },
  {
    name: 'StreamsSetSealDetails',
    component: StreamsSetSealDetailsPage,
    initialParams: {
      title: 'Streams Set Seal Details',
      nextScreen: 'FilterPage-1',
    },
  },
  {
    name: 'StreamFilterPage',
    component: FilterPage,
    initialParams: { title: 'Filter', nextScreen: 'SlamshutPage' },
  },
  {
    name: 'StreamSlamshutPage',
    component: SlamshutPage,
    initialParams: { title: 'Slamshut', nextScreen: 'ActiveRegulatorPage' },
  },
  {
    name: 'StreamActiveRegulatorPage',
    component: ActiveRegulatorPage,
    initialParams: {
      title: 'Active Regulator',
      nextScreen: 'ReliefRegulatorPage',
    },
  },
  {
    name: 'StreamReliefRegulatorPage',
    component: ReliefRegulatorPage,
    initialParams: { title: 'Relief Regulator', nextScreen: 'WaferCheckPage' },
  },
  {
    name: 'StreamWaferCheckPage',
    component: WaferCheckPage,
    initialParams: { title: 'Wafer Check', nextScreen: 'Regulator' },
  },
  { name: 'Regulator', component: RegulatorPage },
  {
    name: 'RegulatorPhotoPage',
    component: GenericPhotoPage,
    initialParams: {
      title: 'New Regulator photo',
      photoKey: 'RegulatorPhotoPage',
      nextScreen: 'ChatterBox',
    },
  },
  { name: 'ChatterBox', component: ChatterBoxPage },
  { name: 'AdditionalMaterial', component: AdditionalMaterialPage },
  { name: 'MaintenanceQuestions', component: MaintenanceQuestionsPage },
];
