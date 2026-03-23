# Profil Data Model

- **name :** 

  - string

  - max : 50 characters

  - default value : Username1 (number get higher when new users)

  - if empty, can't save. Message says 'need at least 2 characters'. If leaves modify without savaing, returns to its previous value

- **bio** 

  - string
  
  - max : 160 characters

  - default value empty

  - bio is **not** a must

- **avatar** 

  - string

  - either a file path or a base64-encoded image

  - default is the default pfp that every app has

  - in case of a none existant file, error message appear 
  
    - *404 : Source doesnt exist*
    
    - *500 : Error server*

- **theme** 

  - string
  
  - one of the predefined theme names

  - default theme uses primary colors of the app

  - will make that a fonction if enough time 

- **colors** 

  - object with properties background, primary, cardBackground, textColor

  - default colors uses primary colors of the app :

    - *background : #214B59*
    
    - *bigCard : #40798C*
    
    - *title / bio / socials : #FFFEF9*
    
    - *linkCard : #95CBDC*
    
    - *linkText : #0B2027*

  - if possible : if user wants to go back while making changes, have pop-up saying *'are you sure you wanna leave, it will discard all your changes'*

- **social links** 

  - array of objects
  
  - each containing platform and url

  - if URL doesnt exis -> error message

    - *404 : Source doesnt exist*
    
    - *500 : error server*

  - if possible : if user wants to go back while adding a link or making changes, have pop-up saying *'are you sure you wanna leave, it will discard all your changes'*




# Link Data Model

- **id**
  - Type : string
  - Unique id for each link
  - It can be generated using Date.now().toString(), or incrementing by 1 the current maximum numeric ID in existing links

- **title**
  - Type : string
  - Max length : 80 characters
  - Required, it can't be empty. If it exceeds 80 characters it will be rejected

- **url**
  - Type : string
  - Required, it can't be empty
  - Must start with "http://" or "https://"
  - Invalid URLs will be rejected
  
- **icon**
  - Type : string
  - The icon is optional and displayed with the link. Local file path or empty.
  - If the file patch doesn't exist, it will show a generic link icon
  - Default value : ""

- **order**
  - Type : number
  - It determines the display order of links on the public page. 
  - When a new link is created, "order = max(current orders) + 1" and it's always appended at the end
  - When a link is deleted, the remaining orders should be recalculated to remove gaps (ex: 1,2,3 instead of 1,3,4)
  - It must be a positive integer
  - Default value : max current order + 1

- **active**
  - Type : boolean
  - It determines if the links is visible on the public page
  - Optional 
  - Default value : true

- **cratedAt**
  - Type : string
  - Format: ISO 8601 date (YYYY-MM-DDTHH:mm:ss.sssZ)
  - Timestamp when the link is created
  - Auto-generated at creation
  - Default value : new Date().toISOString()
