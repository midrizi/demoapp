import React, {
  useEffect,
  useLayoutEffect,
  useState, // @demo remove-current-line
} from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import * as Updates from "expo-updates"
import { observer } from "mobx-react-lite"
import { SafeAreaView } from "react-native-safe-area-context"

import {
  Header, // @demo remove-current-line
  Text,
} from "../components"
import { isRTL } from "../i18n"
import { useStores } from "../models"
// @demo remove-current-line
import { AppStackScreenProps } from "../navigators"
// @demo remove-current-line
import { colors, spacing } from "../theme"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {} // @demo remove-current-line

export const WelcomeScreen = observer(function WelcomeScreen(
  props: WelcomeScreenProps, // @demo remove-current-line
) {
  // @demo remove-block-start
  const { navigation } = props
  const {
    authenticationStore: { setAuthToken },
  } = useStores()

  function logout() {
    setAuthToken(undefined)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <Header rightTx="welcomeScreen.headerRight" onRightPress={logout} />,
    })
  }, [])
  // @demo remove-block-end

  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateManifest, setUpdateManifest] = useState({})

  useEffect(() => {
    const timer = setInterval(async () => {
      // Check for updates only if app is in background.
      // Checking for updates doesn't work in DEV mode, only works in production.
      if (__DEV__) return

      const update = await Updates.checkForUpdateAsync()
      console.log({ update })
      if (update.isAvailable) {
        setUpdateAvailable(true)
        setUpdateManifest(update.manifest)
        await Updates.fetchUpdateAsync()
        await Updates.reloadAsync()
      }
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={$welcomeHeading}
          tx="welcomeScreen.readyForLaunch"
          preset="heading"
        />
        <Text tx="welcomeScreen.exciting" preset="subheading" />
        <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />
      </View>

      <SafeAreaView style={$bottomContainer} edges={["bottom"]}>
        <View style={$bottomContentContainer}>
          {/* <Text tx="welcomeScreen.postscript" size="md" /> */}
          <Text>{`Update id: ${Updates.updateId}`}</Text>
          <Text>{`Update Available: ${updateAvailable}`}</Text>
          <Text>{`Manifest: ${JSON.stringify(updateManifest)}`}</Text>
        </View>
      </SafeAreaView>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.large,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
}

const $bottomContentContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.large,
  justifyContent: "space-around",
}

const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.huge,
}

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.medium,
}
