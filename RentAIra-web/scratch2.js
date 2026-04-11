const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/common/PropertyCard.tsx',
  'src/pages/Tenant/Profile.tsx',
  'src/pages/Tenant/Properties.tsx',
  'src/pages/Tenant/Dashboard.tsx',
  'src/pages/Landlord/Profile.tsx',
  'src/pages/Landlord/Dashboard.tsx',
  'src/pages/Landlord/Properties.tsx'
];

const absPath = (p) => path.join('/Users/kiran/Desktop/RentAIra/RentAIra-web', p);

filesToUpdate.forEach(file => {
  const p = absPath(file);
  if (fs.existsSync(p)) {
     let content = fs.readFileSync(p, 'utf8');
     content = content.replace(/County/g, 'Country');
     content = content.replace(/Counties/g, 'Countries');
     // fix specific Cook County mistake
     content = content.replace(/Cook Country/g, 'Orange Country'); // or just 'United States'
     content = content.replace(/Orange Country/g, 'United States');
     fs.writeFileSync(p, content, 'utf8');
  }
});
console.log('done replacing County with Country');
