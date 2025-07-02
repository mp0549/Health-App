// import { Slot, usePathname } from 'expo-router';
// import { View, StyleSheet, Image, Pressable } from 'react-native';
// import { Link } from 'expo-router';

// export default function Layout() {
//   const pathname = usePathname();

//   const showNavbar = pathname !== '/';

//   return (
//     <View style={{ flex: 1 }}>
//       {showNavbar && (
//         <View style={styles.navbar}>
//           <Link href="/" asChild>
//             <Pressable>
//               <Image
//                 source={{ uri: 'https://picsum.photos/200/300' }}
//                 style={styles.logo}
//               />
//             </Pressable>
//           </Link>
//         </View>
//       )}
//       <Slot />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   navbar: {
//     height: 60,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 4, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//   },
//   logo: {
//     width: 40,
//     height: 40,
//     borderRadius: 20, // makes it a circle
//   },
// });
import { Slot } from 'expo-router';
import { View, Image, Pressable, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.navbar}>
        <Link href="/" asChild>
          <Pressable style={styles.pressable}>
            <Image
              source={{ uri: 'https://picsum.photos/200/300' }}
              style={styles.logo}
            />
            <Text style={styles.navText}>LOGO - Tap to Home</Text>
          </Pressable>
        </Link>
      </View>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: 'tomato',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  navText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
