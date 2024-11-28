<template>
    <Navbar
     expand="lg"
     background-color="body-tertiary"
    >
     <Container type="fluid">
      <NavbarBrand>Navbar w/ text</NavbarBrand>
      <NavbarToggler />
      <NavbarCollapse>
       <NavbarNavList margin="e-auto b-2 b-lg-0">
        <NavItem>
         <NavLink active>
          Home
         </NavLink>
        </NavItem>
        <NavItem>
         <NavLink>Features</NavLink>
        </NavItem>
        <NavItem>
         <NavLink>Pricing</NavLink>
        </NavItem>
       </NavbarNavList>
       <NavbarText>Navbar text with an inline element</NavbarText>
      </NavbarCollapse>
     </Container>
    </Navbar>
   </template>