<Stack.Screen key="GenericPhotoPageEcvToMovPhoto"
name="EcvToMovExisting" 
component={GenericPhotoPage} 
initialParams={{title:'Existing Ecv To Mov Photo', photoKey: 'ExistingECV', nextScreen:'RemovedMeterDetailsPage'}} 
/>
<Stack.Screen name="DataLoggerDetailsPage" component={DataLoggerDetailsPage} />



<Stack.Screen name="RemovedMeterDetailsPage" component={MeterDetailsPage} />


<Stack.Screen 
key = "RemovedMeterDataBadgePhoto"
name='RemovedMeterDataBadge '
component={GenericPhotoPage} 
initialParams={{title: 'Removed Meter data badge',photoKey: 'RemovedMeterDataBadge',nextScreen:'RemovedMeterIndex'}}
/>


<Stack.Screen 
key = "GenericPhotoPageMeterIndexPhoto"
name='RemovedMeterIndex'
component={GenericPhotoPage} 
initialParams={{title: 'Removed Meter index photo',photoKey: 'RemovedMeterIndex',nextScreen:'RemovedMeterPhoto'}}
/>

<Stack.Screen 
key = "removedMeterPhoto"
    name='RemovedMeterPhoto'
    component={GenericPhotoPage} 
    initialParams={{title: 'Removed Meter photo',photoKey: 'RemovedMeterPhoto',nextScreen:'RemovedCorrector'}}
/>  
<Stack.Screen name="RemovedCorrectorDetailsPage" component={CorrectorDetailsPage} />
<Stack.Screen name="NewMeterDetailsPage" component={MeterDetailsPage} />
<Stack.Screen key="EcvToMovPhoto"
name={`EcvToMov`} 
component={GenericPhotoPage} 
initialParams={{title: 'ECV to MOV Photo',photoKey: 'EcvToMov',nextScreen:'MeterDataBadge'}}
/>        
<Stack.Screen 
key = "MeterDataBadgePhoto"
name={`GenericPhotoPageMeterDataBadgePhoto-${jobType}`} 
component={GenericPhotoPage} 
initialParams={{title: 'MeterDataBadgePhoto',photoKey: 'MeterDataBadge',nextScreen:'MeterIndexPhoto'} }
/>

<Stack.Screen 
key = "MeterIndexPhoto"
name='MeterIndexPhoto'
component={GenericPhotoPage} 
initialParams={{title: 'Meter index photo',photoKey: 'MeterIndex',nextScreen:'MeterPhoto'}}  
/>
<Stack.Screen 
key = "MeterPhoto"
    name='MeterPhoto'
    component={GenericPhotoPage} 
    initialParams={{title: 'Meter photo',photoKey: 'MeterPhoto',nextScreen:'CorrectorDetailsPage'}} 
/>
<Stack.Screen name="CorrectorDetailsPage" component={CorrectorDetailsPage} />
