import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;

export const imageStyle = Styles.style({
    transform: 'translateY(-100%)',
    $nest: {
        '&>img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
        }
    }
});

export const cardStyle = Styles.style({
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    $nest: {
        '&:hover': {
            border: `1px solid ${Theme.divider} !important`
        }
    }
})

export const numberInputStyle = Styles.style({
    $nest: {
        'input': {
            textAlign: 'center'
        }
    }
})

export const imageListStyle = Styles.style({
    $nest: {
        'i-image.active img': {
            borderColor: Theme.colors.error.main
        }
    }
})

export const markdownStyle = Styles.style({
    overflowWrap: 'break-word'
})