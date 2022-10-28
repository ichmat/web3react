import React, { useContext, useEffect, useState,useCallback } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  createTheme,
  ThemeProvider, Stack,
  TextField
} from "@mui/material";
import {AppTheme} from "../lib/theme";
import {MyContractContext} from "../lib/MyContractContext";
import {Web3Context} from "../lib/Web3Context";

const Home = (props) => {
  const MyContract = useContext(MyContractContext);
  const web3Context = useContext(Web3Context);
  const [isLoaded, setIsLoaded] = useState(false);
  const [accountLoaded, setAccountLoaded] = useState(false);
  const [account, setAccount] = useState();
  const [contractInstance, setContractInstance] = useState(null);

  const initConfig = useCallback(() => {
    web3Context.eth.requestAccounts((error, coinbaseAddress) => {
      if (error) {
        setAccount(null);
        setAccountLoaded(true);
        return console.error(error);
      }
      if (coinbaseAddress !== account){
        setAccount(coinbaseAddress);
        setAccountLoaded(true);
      }
    });
  }, [account, web3Context.eth]);

  useEffect(() => {
    setTimeout(() => {
      initConfig();
    }, 500);
  }, [])

  useEffect(() => {
    MyContract
      ?.deployed()
      ?.then(async function(instance) {
        setContractInstance(instance);
        setIsLoaded(true);
        console.log(await instance._owner());
      })
      ?.catch(e => {
        // Failed to load web3, accounts, or contract. Check console for details.
        console.error(e);
        setIsLoaded(true);
        console.log('fail loading');
      });
  }, []);

  let isOwner = false;

  useEffect(() => {
    if(contractInstance && account){
      contractInstance._owner().then((value) => {
        console.log(value, account);
        if(value == account[0]){
          isOwner = true;
        };
      })
    }
  }, [contractInstance, account]);

  return (
    <ThemeProvider theme={createTheme(AppTheme)}>
      <Box sx={{ p: 2, pt: 10, flexGrow: 1 }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            item
            container
            xs={12} md={8} lg={8}
            justifyContent="center"
          >
            <Stack direction="column">
              <Typography component="div" align="center" gutterBottom>
                <img
                  alt=""
                  style={{ height: 250 }}
                  src="Ethereum_Two Color.svg"
                />
              </Typography>
              <Typography variant="h6" align="center" gutterBottom>
                {(isLoaded && accountLoaded && isOwner) ? (
                  <Stack> 
                    <Button>You are the owner</Button>
                  </Stack>
                ) 
                : ( 
                <Stack> 
                  <Button>You are not the owner</Button>
                </Stack>
                ) }
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
