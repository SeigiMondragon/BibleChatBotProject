<?php

foreach (glob(base_path('routes/module/*.php')) as $file) {
    require $file;
}
