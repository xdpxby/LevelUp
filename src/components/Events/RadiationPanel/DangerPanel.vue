<template>
    <div class="danger-panel">
        <span class="danger-title">{{ t('radiation.autoDanger') }}</span>
        <input novalidate v-model.number="hero.rad.tempTarget" type="number" :placeholder="t('radiation.targetPower')" class="danger-input" />

        <div class="danger-buttons">
            <button @click="hero.rad.radTarget = hero.rad.tempTarget">{{ t('common.set') }}</button>
            <button @click="maxDangerUp">{{ t('common.max') }}</button>
        </div>

    </div>
</template>

<script setup>
import { useRadiations } from '../../../composables/battleUtils/useRadiation';
import { useHero } from '../../../composables/useHero';
import { useI18n } from 'vue-i18n';

const {
    adjustDanger,
    maxDangerUp
} = useRadiations();

const { t } = useI18n();

const { hero } = useHero();
</script>



<style lang="css" scoped>
.danger-panel {
    border: 1px solid #66ff66;
    padding: 10px;
    width: 200px;
    background: rgba(0, 0, 0, 0.4);
    font-size: 12px;
    text-align: center;
}

.danger-header {
    display: flex;
    justify-content: space-between;
    color: #66ff66;
    font-weight: bold;
}

.danger-title {
    font-size: 18px;
    font-weight: bold;
}

.danger-value {
    text-shadow: 0 0 6px #66ff66;
}

.danger-power {
    margin: 4px 0;
    opacity: 0.8;
}

.danger-input {
    width: 100%;
    margin-top: 5px;
    background: #000;
    border: 1px solid #66ff66;
    color: #66ff66;
    padding: 2px;
}

.danger-buttons {
    display: flex;
    gap: 4px;
    margin-top: 5px;
}

.danger-buttons button {
    flex: 1;
    background: black;
    border: 1px solid #66ff66;
    color: #66ff66;
    cursor: pointer;
}

.danger-buttons button:hover {
    background: #66ff66;
    color: black;
}

.danger-info {
    margin-top: 5px;
    font-size: 11px;
    opacity: 0.7;
}
</style>
