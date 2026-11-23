const dateString = date => new Intl.DateTimeFormat('en-CA', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
export class DemoStore {
 constructor(changed=()=>{}) {
  this.changed=changed; this.ready=true; this.error='';
  this.data={entries:[],backup:null,source:{mode:'demo'}};
  const meals=[['Oatmeal and berries',360,12,56,10,'Breakfast','1 bowl'],['Vegetable rice bowl',520,18,75,16,'Lunch','Rice, chickpeas, and roasted vegetables'],['Pasta with tomato sauce',610,22,91,18,'Dinner','1 plate'],['Yogurt and fruit',180,15,23,3,'Snack','1 cup']];
  for(let i=0;i<7;i++) {
   const date=new Date();date.setDate(date.getDate()-i);
   for(const [name,calories,protein,carbs,fat,meal,description] of meals) this.data.entries.push({id:crypto.randomUUID(),type:'food',date:dateString(date),name,calories:calories+i*5,protein,carbs,fat,meal,description,readOnly:false,sample:true,source:'Fictional example'});
   if(i%2===0) this.data.entries.push({id:crypto.randomUUID(),type:'workout',date:dateString(date),name:i%4?'Cycling':'Neighborhood walk',minutes:25+i*5,calories:null,description:'Fictional sample activity',readOnly:false,sample:true,source:'Fictional example'});
  }
 }
 entries(){return structuredClone(this.data.entries)}
 pending(){return []}
 save(entry,deleted=false){
  if(!entry?.id || !['food','workout'].includes(entry.type) || !entry.name?.trim()) throw Error('Enter a name and valid entry type.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(entry.date))throw Error('Choose a date.');
  const value=entry.type==='food'?entry.calories:entry.minutes;
  if(typeof value!=='number'||!Number.isFinite(value)||value<0||(entry.type==='workout'&&value===0))throw Error('Enter a valid amount.');
  this.data.entries=this.data.entries.filter(e=>e.id!==entry.id);
  if(!deleted)this.data.entries.push(structuredClone({...entry,readOnly:false}));
  this.changed(); return true;
 }
 async flush(){}
 async poll(){}
 async resolve(){}
}
