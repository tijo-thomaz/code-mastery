

"I've been working with React since 2016 across domains like healthcare, insurance, and ecommerce. My most recent role was at Bet365 where I was part of a team rewriting their legacy platform to a modern React + TypeScript + Go stack. My specific contribution was building a config-driven form engine for KYC flows — the forms were locale-aware, so the same engine handled multiple markets. We used Redux Toolkit for state, Feature Sliced Design for architecture, and a custom design token system for CSS. It was complex because KYC has strict compliance requirements, so the engine needed to be both flexible and auditable. I'm now looking for a senior role where I can bring that kind of architectural thinking to a product team."




Redux tool kit enforces bilerplates for efficencey so the code quality and errors could be captured

and we have complex state management for kyc cause the app uses multi country locale driven design as each country have its regulkation for kyc that could easilt managed globally

context driven approaches are only suitable where we need gloabl mininmal states such as theme country id stateid currency  id language id to be passed accross children we could use but considering the complexityu of kyc we took rtk for state managements


so we create recodrs of type based forms and custom base forms for a parsticulat use cases and mappde those using lazy imports and render the elements in that multi step form or complex form

so when a regulatd domain we get formlib elemnts maped with kyclib as the barain 

each form is and extention of the base config form and based on that 

type:"cust_in"
role:currency 
element: "name space of the elemnent "
base element

which will check the recored and return the elements and gets renderd 

and as this is locale driven we have class filess for handeling singleton instance of the form and giving the renbeedred fdatda


formlib/
     ui/textfiled
       /inputfiled
       /button
       /base
       /label
       /text
     css/textinput.css
        /inputfield.css
     validtor/
         emailvalidator
         currency validator
     /formlib.json 
       consts oof the name spaces for the classes


 kyclib
     /formsshell
         /header{formlib.text to show content}
         /footer
         /content{get form config and fetch the form lib based on the config provide by locale }
    /formhandlers
         /attch handlers for the data in and out of the form

    /kyclib.json



kycmodule/
       kycmodule.ts
       locale
          /fr
          /br
            /ui
              kycformbrconfig.ts extends base form kycmodule.ts
              and pass the requiremenst form the backend config and conditions based if the ui should be like this as we had edd  bdd types jumio and onfid 
            tsconfig.json {imports the formlib and kyc to the folder and extend the,} 
          /uk
  config.ljso


