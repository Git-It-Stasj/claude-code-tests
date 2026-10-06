# GitHub raw collection: karpathy

Collected 2026-10-06. Public repos and gists of GitHub user `karpathy`. Word counts = whitespace-split tokens of the raw file (utf-8, errors replaced); .ipynb counted on raw JSON. Shallow clone (depth 1, HEAD of default branch), .git removed.

## How the list was obtained

- `api.github.com/users/karpathy/repos` is blocked in this sandbox (403, sessions bound to configured repos), so the repo list came from the GitHub MCP search (`user:karpathy`, plus `user:karpathy fork:only`). repos.json holds the 54 non-fork repos returned (search result objects, not the raw REST schema). The 9 forks are not in repos.json.
- Gist API is also blocked; gist IDs were scraped from the HTML listing `gist.github.com/karpathy?page=1..3` (13 gists found; page 3 was empty). The HTML listing could not be cross-checked against the API, so the gist list may be incomplete (e.g. if the page was truncated or secret/unlisted gists exist).
- No authenticated rate-limited API calls were made for cloning; git over the proxy worked for every repo.

## Fork decisions

Forks (9): checked locally with `git log` on bare clones for commits authored by karpathy.

| fork | decision | evidence |
|---|---|---|
| scriptsbots | INCLUDED | 7 of 29 commits authored by karpathy |
| nn | INCLUDED | 1 of 653 commits authored by karpathy |
| optim | INCLUDED | 4 of 178 commits authored by karpathy |
| simple-amt | INCLUDED | 1 of 41 commits authored by karpathy |
| lifejs | not fetched | 0 commits by karpathy (4 commits, author Jim) |
| examples | not fetched | 0 commits by karpathy (313 checked) |
| sqlitedict | not fetched | 0 commits by karpathy (199 checked) |
| cpython | not fetched | very large fork; GitHub commit search for author:karpathy returned 0; full history not inspected |
| transformers | not fetched | very large fork; GitHub commit search for author:karpathy returned 0; full history not inspected |

Note: included forks contain upstream files too (shallow clone of the fork as-is), not only his commits.

## Grand total

- Units (repos + gists): 71 (58 repos, 13 gists)
- Kept files: 1572
- Total words: 5076354
- Skipped files (binary/large): 396

## Per-unit summary

| unit | files kept | words | skipped |
|---|---|---|---|
| EigenLibSVM | 6 | 1703 | 0 |
| LLM101n | 1 | 338 | 1 |
| MatlabWrapper | 5 | 1181 | 0 |
| Random-Forest-Matlab | 14 | 3602 | 1 |
| _gists/00103b0037c5aaea32fe1da1af553355 | 1 | 819 | 0 |
| _gists/1dd0294ef9567971c1e4348a90d69285 | 1 | 291 | 0 |
| _gists/442a6bf555914893e9891c11519de94f | 1 | 1959 | 0 |
| _gists/587454dc0146a6ae21fc | 1 | 1237 | 0 |
| _gists/77fbb6a8dac5395f1b73e7a89300318d | 1 | 538 | 0 |
| _gists/7bae8033dcf5ca2630ba | 1 | 139 | 0 |
| _gists/8627fe009c40f57531cb18360106ce95 | 1 | 1229 | 0 |
| _gists/88701557e59199f16045 | 1 | 41 | 0 |
| _gists/a4166c7fe253700972fcbc77e4ea32c5 | 1 | 776 | 0 |
| _gists/d4dee566867f8291f086 | 1 | 648 | 0 |
| _gists/e5d58e83d9fb6ce0827f0f66b253e6fe | 1 | 83 | 0 |
| _gists/f3ee599538ff78e1bbe9 | 1 | 144 | 0 |
| _gists/fb64880bf1f99d58d6c759c966616922 | 1 | 458 | 0 |
| arxiv-sanity-lite | 23 | 8174 | 3 |
| arxiv-sanity-preserver | 23 | 17350 | 7 |
| autoresearch | 9 | 28640 | 1 |
| build-nanogpt | 6 | 208290 | 0 |
| calorie | 2 | 662 | 1 |
| char-rnn | 14 | 209856 | 0 |
| convnetjs | 54 | 42174 | 2 |
| covid-sanity | 11 | 2618 | 3 |
| cryptos | 21 | 26033 | 0 |
| deep-vector-quantization | 14 | 3678 | 0 |
| find-birds | 6 | 1374 | 1 |
| forestjs | 9 | 6871 | 14 |
| gitstats | 7 | 3003 | 0 |
| hn-time-capsule | 6 | 11287 | 1 |
| jobs | 362 | 3165443 | 0 |
| karpathy | 1 | 5 | 0 |
| karpathy.github.io | 40 | 105804 | 117 |
| lecun1989-repro | 6 | 3541 | 1 |
| llama2.c | 22 | 27163 | 3 |
| llm-council | 38 | 20987 | 1 |
| llm.c | 102 | 154834 | 0 |
| makemore | 4 | 35960 | 0 |
| micrograd | 11 | 3953 | 2 |
| minGPT | 17 | 9588 | 1 |
| minbpe | 15 | 35125 | 1 |
| nanoGPT | 24 | 13485 | 2 |
| nanochat | 51 | 87591 | 2 |
| neuraltalk | 40 | 19492 | 22 |
| neuraltalk2 | 28 | 17217 | 1 |
| ng-video-lecture | 5 | 206099 | 0 |
| nipspreview | 15 | 6178 | 0 |
| nn | 175 | 72140 | 21 |
| nn-zero-to-hero | 9 | 25966 | 0 |
| notpygamejs | 8 | 2814 | 0 |
| optim | 40 | 10812 | 0 |
| paper-notes | 5 | 4853 | 17 |
| pytorch-made | 3 | 1518 | 1 |
| pytorch-normalizing-flows | 7 | 5052 | 1 |
| randomfun | 18 | 42740 | 2 |
| reader3 | 9 | 8101 | 1 |
| recurrentjs | 7 | 23603 | 14 |
| reinforcejs | 22 | 33790 | 21 |
| rendergit | 4 | 2284 | 0 |
| researchlei | 11 | 9034 | 5 |
| researchpooler | 10 | 3016 | 0 |
| rustbpe | 11 | 9999 | 0 |
| scholaroctopus | 6 | 197456 | 0 |
| scriptsbots | 29 | 24248 | 4 |
| simple-amt | 27 | 4088 | 0 |
| svmjs | 13 | 7594 | 15 |
| tf-agent | 2 | 629 | 0 |
| tsnejs | 2 | 1998 | 1 |
| twoolpy | 8 | 1883 | 0 |
| ulogme | 121 | 85075 | 105 |

## Per-unit file listings

### EigenLibSVM

Files: 6, words: 1703

| file | bytes | words |
|---|---|---|
| CMakeLists.txt | 241 | 15 |
| Readme.md | 1158 | 177 |
| include/eigenlibsvm/eigen_extensions.h | 4796 | 521 |
| include/eigenlibsvm/svm_utils.h | 1817 | 222 |
| src/svm_utils.cpp | 5257 | 586 |
| test/svm_test.cpp | 1723 | 182 |

### LLM101n

Files: 1, words: 338

| file | bytes | words |
|---|---|---|
| README.md | 2398 | 338 |

### MatlabWrapper

Files: 5, words: 1181

| file | bytes | words |
|---|---|---|
| CMakeLists.txt | 1114 | 100 |
| Readme.md | 2770 | 434 |
| include/MatlabWrapper/MatlabWrapper.h | 1622 | 214 |
| src/MatlabWrapper.cpp | 2891 | 319 |
| test/test1.cpp | 786 | 114 |

### Random-Forest-Matlab

Files: 14, words: 3602

| file | bytes | words |
|---|---|---|
| README.txt | 1887 | 231 |
| demos/forestdemo.m | 3144 | 385 |
| demos/svmdemo.m | 1823 | 218 |
| lib/forestTest.m | 649 | 85 |
| lib/forestTrain.m | 1780 | 248 |
| lib/localContrastNormalize.m | 1591 | 240 |
| lib/mgd.m | 2414 | 359 |
| lib/storage.m | 111 | 18 |
| lib/svmTest.m | 687 | 69 |
| lib/svmTrain.m | 3331 | 431 |
| lib/treeTest.m | 1568 | 240 |
| lib/treeTrain.m | 1627 | 255 |
| lib/weakTest.m | 1087 | 148 |
| lib/weakTrain.m | 5637 | 675 |

### _gists/00103b0037c5aaea32fe1da1af553355

Files: 1, words: 819

| file | bytes | words |
|---|---|---|
| stablediffusionwalk.py | 7696 | 819 |

### _gists/1dd0294ef9567971c1e4348a90d69285

Files: 1, words: 291

| file | bytes | words |
|---|---|---|
| add_to_zshrc.sh | 2551 | 291 |

### _gists/442a6bf555914893e9891c11519de94f

Files: 1, words: 1959

| file | bytes | words |
|---|---|---|
| llm-wiki.md | 11985 | 1959 |

### _gists/587454dc0146a6ae21fc

Files: 1, words: 1237

| file | bytes | words |
|---|---|---|
| gistfile1.py | 8928 | 1237 |

### _gists/77fbb6a8dac5395f1b73e7a89300318d

Files: 1, words: 538

| file | bytes | words |
|---|---|---|
| nes.py | 3306 | 538 |

### _gists/7bae8033dcf5ca2630ba

Files: 1, words: 139

| file | bytes | words |
|---|---|---|
| gistfile1.lua | 1245 | 139 |

### _gists/8627fe009c40f57531cb18360106ce95

Files: 1, words: 1229

| file | bytes | words |
|---|---|---|
| microgpt.py | 9319 | 1229 |

### _gists/88701557e59199f16045

Files: 1, words: 41

| file | bytes | words |
|---|---|---|
| gistfile1.txt | 534 | 41 |

### _gists/a4166c7fe253700972fcbc77e4ea32c5

Files: 1, words: 776

| file | bytes | words |
|---|---|---|
| pg-pong.py | 5257 | 776 |

### _gists/d4dee566867f8291f086

Files: 1, words: 648

| file | bytes | words |
|---|---|---|
| min-char-rnn.py | 4515 | 648 |

### _gists/e5d58e83d9fb6ce0827f0f66b253e6fe

Files: 1, words: 83

| file | bytes | words |
|---|---|---|
| pytorch_strangeness.py | 551 | 83 |

### _gists/f3ee599538ff78e1bbe9

Files: 1, words: 144

| file | bytes | words |
|---|---|---|
| gistfile1.lua | 1597 | 144 |

### _gists/fb64880bf1f99d58d6c759c966616922

Files: 1, words: 458

| file | bytes | words |
|---|---|---|
| HELLO.md | 2708 | 458 |

### arxiv-sanity-lite

Files: 23, words: 8174

| file | bytes | words |
|---|---|---|
| .gitignore | 69 | 6 |
| LICENSE | 1063 | 168 |
| Makefile | 213 | 37 |
| README.md | 2284 | 357 |
| arxiv_daemon.py | 4125 | 483 |
| aslite/arxiv.py | 2643 | 292 |
| aslite/db.py | 4883 | 517 |
| compute.py | 2444 | 203 |
| data/readme.md | 194 | 30 |
| requirements.txt | 83 | 5 |
| send_emails.py | 9890 | 1181 |
| serve.py | 16749 | 2107 |
| static/paper_detail.js | 490 | 36 |
| static/paper_list.js | 3544 | 361 |
| static/style.css | 5308 | 635 |
| static/word_list.js | 818 | 79 |
| templates/about.html | 1148 | 159 |
| templates/base.html | 1243 | 120 |
| templates/index.html | 4480 | 473 |
| templates/inspect.html | 503 | 69 |
| templates/profile.html | 2273 | 226 |
| templates/stats.html | 966 | 147 |
| thumb_daemon.py | 3856 | 483 |

### arxiv-sanity-preserver

Files: 23, words: 17350

| file | bytes | words |
|---|---|---|
| .gitignore | 94 | 12 |
| LICENSE.md | 1080 | 171 |
| README.md | 6958 | 1040 |
| analyze.py | 3440 | 433 |
| buildsvm.py | 2210 | 269 |
| download_pdfs.py | 1242 | 161 |
| fetch_papers.py | 4592 | 523 |
| make_cache.py | 3572 | 425 |
| parse_pdf_to_text.py | 1612 | 222 |
| requirements.txt | 248 | 37 |
| schema.sql | 346 | 50 |
| serve.py | 26485 | 2988 |
| static/as-common.js | 10329 | 1119 |
| static/d3.min.js | 146658 | 2806 |
| static/jquery-1.8.3.min.js | 93636 | 1245 |
| static/marked.min.js | 19513 | 267 |
| static/style.css | 8023 | 1000 |
| templates/account.html | 7291 | 749 |
| templates/discuss.html | 11658 | 1112 |
| templates/main.html | 10700 | 1047 |
| thumb_pdf.py | 3808 | 520 |
| twitter_daemon.py | 7452 | 841 |
| utils.py | 2835 | 313 |

### autoresearch

Files: 9, words: 28640

| file | bytes | words |
|---|---|---|
| .gitignore | 279 | 34 |
| .python-version | 5 | 1 |
| README.md | 8039 | 1223 |
| analysis.ipynb | 8208 | 760 |
| prepare.py | 15043 | 1370 |
| program.md | 7039 | 1140 |
| pyproject.toml | 543 | 52 |
| train.py | 26230 | 2406 |
| uv.lock | 443159 | 21654 |

### build-nanogpt

Files: 6, words: 208290

| file | bytes | words |
|---|---|---|
| README.md | 4488 | 686 |
| fineweb.py | 3512 | 377 |
| hellaswag.py | 7713 | 858 |
| input.txt | 1115394 | 202651 |
| play.ipynb | 11211 | 1150 |
| train_gpt2.py | 23576 | 2568 |

### calorie

Files: 2, words: 662

| file | bytes | words |
|---|---|---|
| README.md | 2010 | 371 |
| index.html | 2940 | 291 |

### char-rnn

Files: 14, words: 209856

| file | bytes | words |
|---|---|---|
| .gitignore | 5 | 1 |
| Readme.md | 12795 | 1966 |
| convert_gpu_cpu_checkpoint.lua | 2176 | 312 |
| data/tinyshakespeare/input.txt | 1115394 | 202651 |
| inspect_checkpoint.lua | 954 | 117 |
| model/GRU.lua | 2058 | 237 |
| model/LSTM.lua | 2069 | 236 |
| model/RNN.lua | 1135 | 143 |
| sample.lua | 6035 | 773 |
| train.lua | 16044 | 1964 |
| util/CharSplitLMMinibatchLoader.lua | 7455 | 874 |
| util/OneHot.lua | 670 | 70 |
| util/misc.lua | 344 | 50 |
| util/model_utils.lua | 5151 | 462 |

### convnetjs

Files: 54, words: 42174

| file | bytes | words |
|---|---|---|
| LICENSE | 1077 | 170 |
| Readme.md | 5961 | 749 |
| bower.json | 614 | 56 |
| build/deepqlearn.js | 13702 | 1541 |
| build/util.js | 1722 | 251 |
| build/vis.js | 5819 | 681 |
| compile/build.xml | 1386 | 95 |
| demo/autoencoder.html | 3296 | 296 |
| demo/automatic.html | 9324 | 927 |
| demo/cifar10.html | 6101 | 547 |
| demo/classify2d.html | 3297 | 380 |
| demo/css/automatic.css | 1393 | 164 |
| demo/css/style.css | 1446 | 200 |
| demo/image_regression.html | 3608 | 396 |
| demo/js/autoencoder.js | 16881 | 1833 |
| demo/js/automatic.js | 11401 | 1299 |
| demo/js/classify2d.js | 9853 | 1164 |
| demo/js/image-helpers.js | 1559 | 144 |
| demo/js/image_regression.js | 4873 | 535 |
| demo/js/images-demo.js | 22141 | 2303 |
| demo/js/jquery-1.8.3.min.js | 93636 | 1245 |
| demo/js/npgmain.js | 3311 | 412 |
| demo/js/pica.js | 20897 | 2844 |
| demo/js/regression.js | 3848 | 389 |
| demo/js/rldemo.js | 19309 | 2071 |
| demo/js/trainers.js | 6702 | 729 |
| demo/mnist.html | 5951 | 542 |
| demo/regression.html | 2738 | 257 |
| demo/rldemo.html | 158456 | 861 |
| demo/speedtest.html | 1226 | 143 |
| demo/trainers.html | 2096 | 192 |
| src/convnet_export.js | 258 | 37 |
| src/convnet_init.js | 52 | 9 |
| src/convnet_layers_dotproducts.js | 10425 | 1156 |
| src/convnet_layers_dropout.js | 2479 | 297 |
| src/convnet_layers_input.js | 1209 | 136 |
| src/convnet_layers_loss.js | 6904 | 915 |
| src/convnet_layers_nonlinearities.js | 8183 | 995 |
| src/convnet_layers_normalization.js | 3462 | 380 |
| src/convnet_layers_pool.js | 4230 | 475 |
| src/convnet_magicnet.js | 11824 | 1300 |
| src/convnet_net.js | 7593 | 805 |
| src/convnet_trainers.js | 7413 | 933 |
| src/convnet_util.js | 3644 | 503 |
| src/convnet_vol.js | 3637 | 497 |
| src/convnet_vol_util.js | 2981 | 397 |
| test/jasmine/MIT.LICENSE | 1061 | 167 |
| test/jasmine/SpecRunner.html | 808 | 52 |
| test/jasmine/lib/jasmine-2.0.0/boot.js | 6133 | 739 |
| test/jasmine/lib/jasmine-2.0.0/console.js | 4318 | 514 |
| test/jasmine/lib/jasmine-2.0.0/jasmine-html.js | 11235 | 1056 |
| test/jasmine/lib/jasmine-2.0.0/jasmine.css | 4233 | 483 |
| test/jasmine/lib/jasmine-2.0.0/jasmine.js | 62835 | 6569 |
| test/jasmine/spec/NeuralNetSpec.js | 2945 | 343 |

### covid-sanity

Files: 11, words: 2618

| file | bytes | words |
|---|---|---|
| .gitignore | 17 | 2 |
| LICENSE.md | 1081 | 171 |
| README.md | 2540 | 359 |
| banned.txt | 140 | 9 |
| requirements.txt | 34 | 5 |
| run.py | 4549 | 483 |
| serve.py | 3401 | 397 |
| static/paper_list.js | 2207 | 222 |
| static/style.css | 2864 | 333 |
| templates/index.html | 2080 | 171 |
| twitter_daemon.py | 4069 | 466 |

### cryptos

Files: 21, words: 26033

| file | bytes | words |
|---|---|---|
| .gitignore | 32 | 2 |
| README.md | 7396 | 830 |
| blog.ipynb | 104850 | 14517 |
| cryptos/__init__.py | 0 | 0 |
| cryptos/bitcoin.py | 1200 | 90 |
| cryptos/block.py | 3962 | 414 |
| cryptos/curves.py | 3006 | 447 |
| cryptos/ecdsa.py | 3991 | 551 |
| cryptos/keys.py | 5305 | 681 |
| cryptos/network.py | 11344 | 1226 |
| cryptos/ripemd160.py | 13019 | 2936 |
| cryptos/sha256.py | 5303 | 775 |
| cryptos/transaction.py | 16294 | 1733 |
| getnewaddress.py | 804 | 85 |
| tests/__init__.py | 0 | 0 |
| tests/test_block.py | 3090 | 211 |
| tests/test_ecdsa.py | 2802 | 301 |
| tests/test_hash.py | 1213 | 111 |
| tests/test_keys.py | 3502 | 258 |
| tests/test_network.py | 2596 | 140 |
| tests/test_tx.py | 9573 | 725 |

### deep-vector-quantization

Files: 14, words: 3678

| file | bytes | words |
|---|---|---|
| .gitignore | 1275 | 168 |
| LICENSE | 1059 | 167 |
| README.md | 2367 | 339 |
| dvq/__init__.py | 0 | 0 |
| dvq/data/__init__.py | 0 | 0 |
| dvq/data/cifar10.py | 1510 | 98 |
| dvq/model/__init__.py | 0 | 0 |
| dvq/model/deepmind_enc_dec.py | 1957 | 144 |
| dvq/model/loss.py | 1569 | 205 |
| dvq/model/openai_enc_dec.py | 8340 | 838 |
| dvq/model/quantize.py | 4133 | 427 |
| dvq/vqvae.py | 9214 | 890 |
| requirements.txt | 72 | 10 |
| visualize.ipynb | 360309 | 392 |

### find-birds

Files: 6, words: 1374

| file | bytes | words |
|---|---|---|
| README.md | 1930 | 297 |
| common.py | 2002 | 216 |
| fetch.py | 2015 | 223 |
| report.py | 4642 | 551 |
| report_template.html | 731 | 86 |
| requirements.txt | 6 | 1 |

### forestjs

Files: 9, words: 6871

| file | bytes | words |
|---|---|---|
| MIT-LICENSE | 1059 | 167 |
| README.md | 3450 | 529 |
| demo/demoforest.html | 7735 | 878 |
| demo/jqueryui/css/ui-lightness/jquery-ui-1.8.21.custom.css | 20092 | 1848 |
| demo/jqueryui/js/jquery-1.7.2.min.js | 94840 | 1236 |
| demo/jqueryui/js/jquery-ui-1.8.21.custom.min.js | 24241 | 295 |
| demo/npg_include/npgmain.js | 3300 | 411 |
| demo/npg_include/vector2D.js | 835 | 116 |
| lib/randomforest.js | 11809 | 1391 |

### gitstats

Files: 7, words: 3003

| file | bytes | words |
|---|---|---|
| .gitignore | 30 | 2 |
| README.md | 579 | 105 |
| deploy/index.html | 11588 | 1282 |
| deploy/jquery-3.3.1.min.js | 86927 | 1283 |
| example_repos.json | 329 | 18 |
| requirements.txt | 9 | 1 |
| run.py | 2951 | 312 |

### hn-time-capsule

Files: 6, words: 11287

| file | bytes | words |
|---|---|---|
| .gitignore | 178 | 26 |
| .python-version | 5 | 1 |
| README.md | 3456 | 515 |
| pipeline.py | 58439 | 5551 |
| pyproject.toml | 235 | 26 |
| uv.lock | 107504 | 5168 |

### jobs

Files: 362, words: 3165443

| file | bytes | words |
|---|---|---|
| .gitignore | 271 | 34 |
| .python-version | 5 | 1 |
| README.md | 4537 | 684 |
| build_site_data.py | 1617 | 160 |
| html/accountants-and-auditors.html | 126134 | 9499 |
| html/actors.html | 113068 | 8327 |
| html/actuaries.html | 123023 | 9143 |
| html/administrative-services-managers.html | 127694 | 9098 |
| html/adult-literacy-and-ged-teachers.html | 124571 | 9242 |
| html/advertising-promotions-and-marketing-managers.html | 127532 | 9138 |
| html/advertising-sales-agents.html | 114697 | 8483 |
| html/aerospace-engineering-and-operations-technicians.html | 115444 | 8274 |
| html/aerospace-engineers.html | 119383 | 8593 |
| html/agricultural-and-food-science-technicians.html | 129297 | 9308 |
| html/agricultural-and-food-scientists.html | 130767 | 9611 |
| html/agricultural-engineers.html | 122205 | 8866 |
| html/agricultural-workers.html | 125958 | 9181 |
| html/air-traffic-controllers.html | 115991 | 8885 |
| html/aircraft-and-avionics-equipment-mechanics-and-technicians.html | 135014 | 9888 |
| html/airline-and-commercial-pilots.html | 125959 | 9729 |
| html/animal-care-and-service-workers.html | 125652 | 9349 |
| html/announcers.html | 123550 | 9258 |
| html/anthropologists-and-archeologists.html | 118392 | 8537 |
| html/appraisers-and-assessors-of-real-estate.html | 113142 | 8437 |
| html/arbitrators-mediators-and-conciliators.html | 115099 | 8401 |
| html/architects.html | 121162 | 8796 |
| html/architectural-and-engineering-managers.html | 120957 | 8595 |
| html/art-directors.html | 114710 | 8389 |
| html/assemblers-and-fabricators.html | 133151 | 9637 |
| html/athletes-and-sports-competitors.html | 113631 | 8488 |
| html/athletic-trainers.html | 117717 | 8434 |
| html/atmospheric-scientists-including-meteorologists.html | 122451 | 8975 |
| html/audiologists.html | 113169 | 8176 |
| html/automotive-body-and-glass-repairers.html | 127154 | 9540 |
| html/automotive-service-technicians-and-mechanics.html | 120646 | 8981 |
| html/bakers.html | 110665 | 8173 |
| html/barbers-hairstylists-and-cosmetologists.html | 115958 | 8542 |
| html/bartenders.html | 113898 | 8383 |
| html/bill-and-account-collectors.html | 115501 | 8390 |
| html/biochemists-and-biophysicists.html | 124104 | 9136 |
| html/biological-technicians.html | 120550 | 8543 |
| html/biomedical-engineers.html | 122741 | 8896 |
| html/boilermakers.html | 122309 | 8850 |
| html/bookkeeping-accounting-and-auditing-clerks.html | 122048 | 8899 |
| html/brickmasons-blockmasons-and-stonemasons.html | 124426 | 9065 |
| html/broadcast-and-sound-engineering-technicians.html | 127729 | 9424 |
| html/budget-analysts.html | 117810 | 8376 |
| html/bus-drivers.html | 124323 | 9516 |
| html/butchers-and-meat-cutters.html | 109095 | 8014 |
| html/calibration-technologists-and-technicians.html | 116218 | 8322 |
| html/cardiovascular-technologists-and-technicians.html | 118802 | 8574 |
| html/career-and-technical-education-teachers.html | 128319 | 9404 |
| html/carpenters.html | 120639 | 8810 |
| html/cartographers-and-photogrammetrists.html | 116694 | 8248 |
| html/cashiers.html | 110776 | 7919 |
| html/chefs-and-head-cooks.html | 115034 | 8677 |
| html/chemical-engineers.html | 117392 | 8500 |
| html/chemical-technicians.html | 118549 | 8390 |
| html/chemists-and-materials-scientists.html | 132155 | 9599 |
| html/childcare-workers.html | 116399 | 8735 |
| html/chiropractors.html | 117109 | 8492 |
| html/civil-engineering-technicians.html | 113102 | 8212 |
| html/civil-engineers.html | 124217 | 9045 |
| html/claims-adjusters-appraisers-examiners-and-investigators.html | 128613 | 9685 |
| html/clinical-laboratory-technologists-and-technicians.html | 119993 | 8699 |
| html/coaches-and-scouts.html | 121851 | 9157 |
| html/community-health-workers.html | 117637 | 8624 |
| html/compensation-and-benefits-managers.html | 120269 | 8659 |
| html/compensation-benefits-and-job-analysis-specialists.html | 119132 | 8577 |
| html/compliance-officers.html | 119058 | 8464 |
| html/computer-and-information-research-scientists.html | 123959 | 8854 |
| html/computer-and-information-systems-managers.html | 122266 | 8737 |
| html/computer-hardware-engineers.html | 116586 | 8197 |
| html/computer-network-architects.html | 121679 | 8611 |
| html/computer-programmers.html | 120459 | 8493 |
| html/computer-support-specialists.html | 129254 | 9253 |
| html/computer-systems-analysts.html | 125071 | 8983 |
| html/concierges.html | 117587 | 8427 |
| html/conservation-scientists.html | 125378 | 9117 |
| html/construction-and-building-inspectors.html | 125552 | 9217 |
| html/construction-equipment-operators.html | 119584 | 8758 |
| html/construction-laborers-and-helpers.html | 139341 | 9980 |
| html/construction-managers.html | 116530 | 8536 |
| html/cooks.html | 127904 | 9462 |
| html/correctional-officers.html | 120710 | 8956 |
| html/cost-estimators.html | 117852 | 8365 |
| html/court-reporters.html | 113213 | 8604 |
| html/craft-and-fine-artists.html | 134037 | 10430 |
| html/credit-counselors.html | 115045 | 8325 |
| html/curators-museum-technicians-and-conservators.html | 124877 | 9317 |
| html/customer-service-representatives.html | 118378 | 8490 |
| html/dancers-and-choreographers.html | 121432 | 8932 |
| html/data-scientists.html | 116556 | 8353 |
| html/database-administrators.html | 130326 | 9222 |
| html/delivery-truck-drivers-and-driver-sales-workers.html | 122776 | 9066 |
| html/dental-and-ophthalmic-laboratory-technicians-and-medical-appliance-technicians.html | 122334 | 8928 |
| html/dental-assistants.html | 119361 | 8722 |
| html/dental-hygienists.html | 115079 | 8389 |
| html/dentists.html | 128534 | 9317 |
| html/desktop-publishers.html | 110260 | 7813 |
| html/diagnostic-medical-sonographers.html | 119418 | 8652 |
| html/diesel-service-technicians-and-mechanics.html | 117562 | 8747 |
| html/dietitians-and-nutritionists.html | 112894 | 8411 |
| html/drafters.html | 125582 | 8895 |
| html/drywall-and-ceiling-tile-installers-and-tapers.html | 123369 | 9045 |
| html/economists.html | 118768 | 8441 |
| html/editors.html | 114204 | 8385 |
| html/electrical-and-electronics-engineering-technicians.html | 116388 | 8326 |
| html/electrical-and-electronics-engineers.html | 128808 | 9127 |
| html/electrical-and-electronics-installers-and-repairers.html | 129772 | 9330 |
| html/electricians.html | 125104 | 9161 |
| html/electro-mechanical-technicians.html | 117727 | 8331 |
| html/elementary-middle-and-high-school-principals.html | 125206 | 9098 |
| html/elevator-installers-and-repairers.html | 117543 | 8687 |
| html/emergency-management-directors.html | 120087 | 8837 |
| html/emts-and-paramedics.html | 125485 | 9365 |
| html/entertainment-and-recreation-managers.html | 117279 | 8565 |
| html/environmental-engineering-technicians.html | 114184 | 8193 |
| html/environmental-engineers.html | 118503 | 8500 |
| html/environmental-science-and-protection-technicians.html | 122402 | 8788 |
| html/environmental-scientists-and-specialists.html | 121853 | 8713 |
| html/epidemiologists.html | 122103 | 8779 |
| html/exercise-physiologists.html | 115809 | 8251 |
| html/farmers-ranchers-and-other-agricultural-managers.html | 122994 | 9298 |
| html/fashion-designers.html | 116599 | 8649 |
| html/film-and-video-editors-and-camera-operators.html | 124662 | 9408 |
| html/financial-analysts.html | 122840 | 8876 |
| html/financial-clerks.html | 131574 | 9315 |
| html/financial-examiners.html | 115553 | 8221 |
| html/financial-managers.html | 118436 | 8490 |
| html/fire-inspectors-and-investigators.html | 123322 | 9173 |
| html/firefighters.html | 116162 | 8669 |
| html/fishers-and-related-fishing-workers.html | 114629 | 8995 |
| html/fitness-trainers-and-instructors.html | 116159 | 8687 |
| html/flight-attendants.html | 117647 | 8925 |
| html/floral-designers.html | 114201 | 8591 |
| html/food-and-beverage-serving-and-related-workers.html | 125632 | 9331 |
| html/food-and-tobacco-processing-workers.html | 119948 | 8659 |
| html/food-preparation-workers.html | 113443 | 8306 |
| html/food-service-managers.html | 114620 | 8527 |
| html/forensic-science-technicians.html | 120730 | 8779 |
| html/forest-and-conservation-workers.html | 112998 | 8260 |
| html/fundraisers.html | 112723 | 8140 |
| html/funeral-service-occupations.html | 121874 | 9117 |
| html/gaming-services-occupations.html | 128139 | 9498 |
| html/general-maintenance-and-repair-workers.html | 119321 | 8637 |
| html/general-office-clerks.html | 111906 | 7948 |
| html/genetic-counselors.html | 112332 | 8047 |
| html/geographers.html | 118980 | 8446 |
| html/geological-and-petroleum-technicians.html | 123879 | 8890 |
| html/geoscientists.html | 121319 | 8809 |
| html/glaziers.html | 116034 | 8430 |
| html/graphic-designers.html | 118575 | 8701 |
| html/grounds-maintenance-workers.html | 126443 | 9346 |
| html/hand-laborers-and-material-movers.html | 127109 | 9357 |
| html/hazardous-materials-removal-workers.html | 117872 | 8886 |
| html/health-and-safety-engineers.html | 114127 | 8285 |
| html/health-educators.html | 122309 | 8815 |
| html/health-information-technologists-and-medical-registrars.html | 113091 | 8168 |
| html/heating-air-conditioning-and-refrigeration-mechanics-and-installers.html | 121901 | 8962 |
| html/heavy-and-tractor-trailer-truck-drivers.html | 117391 | 8841 |
| html/heavy-vehicle-and-mobile-equipment-service-technicians.html | 127318 | 9495 |
| html/high-school-teachers.html | 123991 | 9264 |
| html/historians.html | 118091 | 8499 |
| html/home-health-aides-and-personal-care-aides.html | 119928 | 9001 |
| html/human-resources-managers.html | 118628 | 8522 |
| html/human-resources-specialists.html | 120165 | 8627 |
| html/hydrologists.html | 118911 | 8494 |
| html/industrial-designers.html | 118347 | 8602 |
| html/industrial-engineering-technicians.html | 114487 | 8103 |
| html/industrial-engineers.html | 122232 | 8735 |
| html/industrial-machinery-mechanics-and-maintenance-workers-and-millwrights.html | 128303 | 9444 |
| html/industrial-production-managers.html | 121204 | 8621 |
| html/information-clerks.html | 138303 | 9867 |
| html/information-security-analysts.html | 120955 | 8569 |
| html/instructional-coordinators.html | 124872 | 8854 |
| html/insulation-workers.html | 125340 | 9120 |
| html/insurance-sales-agents.html | 117069 | 8741 |
| html/insurance-underwriters.html | 114010 | 8205 |
| html/interior-designers.html | 117774 | 8609 |
| html/interpreters-and-translators.html | 132473 | 10184 |
| html/janitors-and-building-cleaners.html | 109117 | 8043 |
| html/jewelers-and-precious-stone-and-metal-workers.html | 116304 | 8671 |
| html/judges-and-hearing-officers.html | 120795 | 9112 |
| html/kindergarten-and-elementary-school-teachers.html | 134818 | 9961 |
| html/labor-relations-specialists.html | 117945 | 8501 |
| html/landscape-architects.html | 119767 | 8658 |
| html/lawyers.html | 117752 | 9033 |
| html/librarians.html | 122265 | 9154 |
| html/library-technicians-and-assistants.html | 118026 | 8512 |
| html/licensed-practical-and-licensed-vocational-nurses.html | 118081 | 8643 |
| html/line-installers-and-repairers.html | 116704 | 8669 |
| html/loan-officers.html | 119386 | 8791 |
| html/lodging-managers.html | 114442 | 8486 |
| html/logging-workers.html | 116517 | 8523 |
| html/logisticians.html | 118904 | 8397 |
| html/machinists-and-tool-and-die-makers.html | 122132 | 9094 |
| html/management-analysts.html | 119414 | 8556 |
| html/manicurists-and-pedicurists.html | 106382 | 7772 |
| html/marine-engineers-and-naval-architects.html | 117797 | 8643 |
| html/market-research-analysts.html | 117707 | 8398 |
| html/marriage-and-family-therapists.html | 120354 | 8689 |
| html/massage-therapists.html | 112168 | 8256 |
| html/material-moving-machine-operators.html | 123869 | 9020 |
| html/material-recording-clerks.html | 114631 | 8267 |
| html/materials-engineers.html | 119526 | 8575 |
| html/mathematicians-and-statisticians.html | 130300 | 9331 |
| html/mechanical-engineering-technicians.html | 113600 | 8082 |
| html/mechanical-engineers.html | 120402 | 8727 |
| html/medical-and-health-services-managers.html | 123694 | 8998 |
| html/medical-assistants.html | 120083 | 8644 |
| html/medical-dosimetrists.html | 113482 | 8175 |
| html/medical-equipment-repairers.html | 118655 | 8644 |
| html/medical-records-and-health-information-technicians.html | 114520 | 8187 |
| html/medical-scientists.html | 120115 | 8689 |
| html/medical-transcriptionists.html | 117656 | 8382 |
| html/meeting-convention-and-event-planners.html | 117451 | 8616 |
| html/metal-and-plastic-machine-workers.html | 156236 | 11598 |
| html/microbiologists.html | 121530 | 8731 |
| html/middle-school-teachers.html | 126656 | 9384 |
| html/military-careers.html | 163148 | 13226 |
| html/mining-and-geological-engineers.html | 121732 | 8906 |
| html/models.html | 113326 | 8518 |
| html/multimedia-artists-and-animators.html | 115606 | 8495 |
| html/music-directors-and-composers.html | 121046 | 9009 |
| html/musicians-and-singers.html | 118212 | 8794 |
| html/natural-sciences-managers.html | 120322 | 8616 |
| html/network-and-computer-systems-administrators.html | 124018 | 8792 |
| html/nuclear-engineers.html | 116698 | 8462 |
| html/nuclear-medicine-technologists.html | 118306 | 8624 |
| html/nuclear-technicians.html | 117277 | 8508 |
| html/nurse-anesthetists-nurse-midwives-and-nurse-practitioners.html | 128629 | 9617 |
| html/nursing-assistants.html | 125448 | 9109 |
| html/occupational-health-and-safety-specialists-and-technicians.html | 123719 | 9112 |
| html/occupational-therapists.html | 118019 | 8667 |
| html/occupational-therapy-assistants-and-aides.html | 128002 | 9449 |
| html/oil-and-gas-workers.html | 126509 | 9410 |
| html/operations-research-analysts.html | 115998 | 8316 |
| html/opticians-dispensing.html | 112959 | 8227 |
| html/optometrists.html | 117012 | 8548 |
| html/orthotists-and-prosthetists.html | 114689 | 8361 |
| html/painters-construction-and-maintenance.html | 116803 | 8645 |
| html/painting-and-coating-workers.html | 117126 | 8573 |
| html/paralegals-and-legal-assistants.html | 112339 | 8181 |
| html/personal-financial-advisors.html | 118219 | 8648 |
| html/pest-control-workers.html | 109620 | 8138 |
| html/petroleum-engineers.html | 117254 | 8475 |
| html/pharmacists.html | 116015 | 8521 |
| html/pharmacy-technicians.html | 111906 | 8092 |
| html/phlebotomists.html | 114297 | 8205 |
| html/photographers.html | 121362 | 8878 |
| html/physical-therapist-assistants-and-aides.html | 124759 | 9096 |
| html/physical-therapists.html | 121715 | 8811 |
| html/physician-assistants.html | 117777 | 8538 |
| html/physicians-and-surgeons.html | 154483 | 11314 |
| html/physicists-and-astronomers.html | 134857 | 9955 |
| html/plumbers-pipefitters-and-steamfitters.html | 123023 | 9023 |
| html/podiatrists.html | 115696 | 8380 |
| html/police-and-detectives.html | 131745 | 9902 |
| html/police-fire-and-ambulance-dispatchers.html | 116194 | 8558 |
| html/political-scientists.html | 115667 | 8218 |
| html/postal-service-workers.html | 123260 | 8927 |
| html/postsecondary-education-administrators.html | 119996 | 8724 |
| html/postsecondary-teachers.html | 174143 | 12165 |
| html/power-plant-operators-distributors-and-dispatchers.html | 126403 | 9340 |
| html/preschool-and-childcare-center-directors.html | 117555 | 8501 |
| html/preschool-teachers.html | 116485 | 8469 |
| html/private-detectives-and-investigators.html | 121386 | 8842 |
| html/probation-officers-and-correctional-treatment-specialists.html | 117745 | 8854 |
| html/producers-and-directors.html | 118283 | 8785 |
| html/project-management-specialists.html | 117342 | 8489 |
| html/property-real-estate-and-community-association-managers.html | 117822 | 8977 |
| html/psychiatric-technicians-and-aides.html | 126535 | 9222 |
| html/psychologists.html | 133326 | 9583 |
| html/public-relations-managers.html | 125869 | 9286 |
| html/public-relations-specialists.html | 116196 | 8358 |
| html/purchasing-managers-buyers-and-purchasing-agents.html | 130154 | 9472 |
| html/quality-control-inspectors.html | 113714 | 8283 |
| html/radiation-therapists.html | 118499 | 8448 |
| html/radiologic-technologists.html | 123555 | 8964 |
| html/railroad-occupations.html | 124954 | 9440 |
| html/real-estate-brokers-and-sales-agents.html | 128555 | 9888 |
| html/receptionists.html | 111189 | 7870 |
| html/recreation-workers.html | 119228 | 8582 |
| html/recreational-therapists.html | 119830 | 8592 |
| html/registered-nurses.html | 128265 | 9618 |
| html/rehabilitation-counselors.html | 121106 | 8675 |
| html/reporters-correspondents-and-broadcast-news-analysts.html | 123728 | 9254 |
| html/respiratory-therapists.html | 119205 | 8646 |
| html/retail-sales-workers.html | 127139 | 9258 |
| html/roofers.html | 117478 | 8571 |
| html/sales-engineers.html | 119436 | 8657 |
| html/sales-managers.html | 119166 | 8659 |
| html/school-and-career-counselors.html | 124401 | 9259 |
| html/secretaries-and-administrative-assistants.html | 131258 | 9317 |
| html/securities-commodities-and-financial-services-sales-agents.html | 120107 | 9249 |
| html/security-guards.html | 123733 | 9146 |
| html/semiconductor-processing-technicians.html | 115658 | 8387 |
| html/set-and-exhibit-designers.html | 116037 | 8576 |
| html/sheet-metal-workers.html | 123058 | 9064 |
| html/skincare-specialists.html | 108212 | 7806 |
| html/small-engine-mechanics.html | 120385 | 8957 |
| html/social-and-community-service-managers.html | 118583 | 8580 |
| html/social-and-human-service-assistants.html | 124246 | 9216 |
| html/social-workers.html | 130645 | 9631 |
| html/sociologists.html | 116867 | 8226 |
| html/software-developers.html | 135091 | 9763 |
| html/solar-photovoltaic-installers.html | 122612 | 8912 |
| html/special-education-teachers.html | 134582 | 9860 |
| html/speech-language-pathologists.html | 121222 | 8707 |
| html/stationary-engineers-and-boiler-operators.html | 119369 | 8896 |
| html/structural-iron-and-steel-workers.html | 122520 | 8929 |
| html/substance-abuse-behavioral-disorder-and-mental-health-counselors.html | 127883 | 9452 |
| html/surgical-technologists.html | 126492 | 9136 |
| html/survey-researchers.html | 119941 | 8617 |
| html/surveying-and-mapping-technicians.html | 116767 | 8412 |
| html/surveyors.html | 120120 | 8611 |
| html/tax-examiners-and-collectors-and-revenue-agents.html | 122700 | 9111 |
| html/taxi-drivers-and-chauffeurs.html | 122945 | 9243 |
| html/teacher-assistants.html | 117554 | 8429 |
| html/technical-writers.html | 116776 | 8401 |
| html/telecommunications-equipment-installers-and-repairers-except-line-installers.html | 121203 | 8848 |
| html/tellers.html | 111297 | 8060 |
| html/tile-and-marble-setters.html | 130007 | 9562 |
| html/top-executives.html | 128277 | 9301 |
| html/tour-and-travel-guides.html | 118279 | 8853 |
| html/training-and-development-managers.html | 122112 | 8797 |
| html/training-and-development-specialists.html | 120343 | 8544 |
| html/transportation-storage-and-distribution-managers.html | 120632 | 8765 |
| html/travel-agents.html | 109821 | 8098 |
| html/tutors.html | 117510 | 8613 |
| html/umpires-referees-and-other-sports-officials.html | 111496 | 8387 |
| html/urban-and-regional-planners.html | 119416 | 8584 |
| html/veterinarians.html | 120355 | 8755 |
| html/veterinary-assistants-and-laboratory-animal-caretakers.html | 115393 | 8217 |
| html/veterinary-technologists-and-technicians.html | 116362 | 8392 |
| html/waiters-and-waitresses.html | 113480 | 8409 |
| html/water-and-wastewater-treatment-plant-and-system-operators.html | 118899 | 8959 |
| html/water-transportation-occupations.html | 133039 | 10033 |
| html/web-developers.html | 125265 | 9057 |
| html/welders-cutters-solderers-and-brazers.html | 118675 | 8793 |
| html/wholesale-and-manufacturing-sales-representatives.html | 133655 | 9933 |
| html/wind-turbine-technicians.html | 115887 | 8379 |
| html/woodworkers.html | 123033 | 9004 |
| html/writers-and-authors.html | 117122 | 8674 |
| html/zoologists-and-wildlife-biologists.html | 123936 | 9101 |
| make_csv.py | 5558 | 516 |
| make_prompt.py | 10466 | 1165 |
| occupational_outlook_handbook.html | 1741028 | 46524 |
| occupations.csv | 92091 | 3246 |
| occupations.json | 79424 | 4231 |
| parse_detail.py | 7862 | 686 |
| parse_occupations.py | 2246 | 255 |
| process.py | 1630 | 172 |
| prompt.md | 177922 | 26669 |
| pyproject.toml | 256 | 27 |
| score.py | 7133 | 841 |
| scores.json | 188420 | 22928 |
| scrape.py | 3420 | 328 |
| site/data.json | 269174 | 28528 |
| site/index.html | 41259 | 5053 |
| uv.lock | 29568 | 1680 |

### karpathy

Files: 1, words: 5

| file | bytes | words |
|---|---|---|
| README.md | 25 | 5 |

### karpathy.github.io

Files: 40, words: 105804

| file | bytes | words |
|---|---|---|
| .gitignore | 16 | 2 |
| Readme.md | 136 | 22 |
| _config.yml | 342 | 38 |
| _includes/footer.html | 3533 | 141 |
| _includes/head.html | 1112 | 77 |
| _includes/header.html | 1509 | 94 |
| _layouts/default.html | 245 | 27 |
| _layouts/page.html | 1384 | 143 |
| _layouts/post.html | 1475 | 153 |
| _posts/2011-04-27-manually-classifying-cifar10.markdown | 4873 | 782 |
| _posts/2012-10-22-state-of-computer-vision.markdown | 6590 | 1182 |
| _posts/2013-11-23-chrome-extension-programming.markdown | 11196 | 1715 |
| _posts/2013-11-27-quantifying-hacker-news.markdown | 2959 | 477 |
| _posts/2014-04-26-datascience-weekly-interview.markdown | 673 | 77 |
| _posts/2014-07-01-switching-to-jekyll.markdown | 4562 | 713 |
| _posts/2014-07-02-visualizing-top-tweeps-with-t-sne-in-Javascript.markdown | 11062 | 1625 |
| _posts/2014-07-03-feature-learning-escapades.markdown | 17769 | 2680 |
| _posts/2014-08-03-quantifying-productivity.markdown | 11143 | 1834 |
| _posts/2014-09-02-what-i-learned-from-competing-against-a-convnet-on-imagenet.markdown | 20174 | 3140 |
| _posts/2015-03-30-breaking-convnets.markdown | 23250 | 3670 |
| _posts/2015-05-21-rnn-effectiveness.markdown | 53579 | 8014 |
| _posts/2015-10-25-selfie.markdown | 27876 | 4264 |
| _posts/2015-11-20-ai.markdown | 48552 | 8105 |
| _posts/2016-05-31-rl.markdown | 44741 | 7153 |
| _posts/2016-09-07-phd.markdown | 49023 | 8374 |
| _posts/2018-01-20-medium.markdown | 738 | 122 |
| _posts/2019-04-25-recipe.markdown | 23695 | 3903 |
| _posts/2020-06-11-biohacking-lite.markdown | 34227 | 5395 |
| _posts/2021-03-27-forward-pass.markdown | 7682 | 1304 |
| _posts/2021-06-21-blockchain.markdown | 85394 | 12756 |
| _posts/2022-03-14-lecun1989.markdown | 17105 | 2733 |
| _posts/2026-02-12-microgpt.markdown | 37111 | 5676 |
| about.md | 112 | 13 |
| assets/bio/atpspring.svg | 87151 | 2288 |
| assets/bio/atpsynthesis.svg | 61967 | 1297 |
| assets/rssicon.svg | 6300 | 261 |
| css/main.css | 10218 | 1360 |
| feed.xml | 1292 | 129 |
| index.html | 369 | 44 |
| nntutorial.md | 82472 | 14021 |

### lecun1989-repro

Files: 6, words: 3541

| file | bytes | words |
|---|---|---|
| LICENSE | 1063 | 168 |
| README.md | 5984 | 1019 |
| modern.py | 8108 | 1066 |
| prepro.py | 1578 | 211 |
| repro.py | 6382 | 770 |
| vis.ipynb | 37168 | 307 |

### llama2.c

Files: 22, words: 27163

| file | bytes | words |
|---|---|---|
| .github/workflows/build.yml | 4209 | 435 |
| LICENSE | 1063 | 168 |
| Makefile | 2330 | 346 |
| README.md | 35271 | 5037 |
| build_msvc.bat | 45 | 7 |
| configurator.py | 1758 | 219 |
| doc/stories260K.md | 2909 | 459 |
| doc/train_llama_tokenizer.md | 3532 | 378 |
| export.py | 24513 | 2160 |
| model.py | 15289 | 1587 |
| requirements.txt | 107 | 7 |
| run.c | 38545 | 5260 |
| run.ipynb | 3981 | 317 |
| runq.c | 43357 | 5827 |
| sample.py | 3397 | 382 |
| test.c | 3574 | 433 |
| test_all.py | 3748 | 406 |
| tinystories.py | 11542 | 1092 |
| tokenizer.py | 2866 | 304 |
| train.py | 13915 | 1671 |
| win.c | 4269 | 459 |
| win.h | 1612 | 209 |

### llm-council

Files: 38, words: 20987

| file | bytes | words |
|---|---|---|
| .gitignore | 219 | 27 |
| .python-version | 5 | 1 |
| CLAUDE.md | 7110 | 966 |
| README.md | 3135 | 489 |
| backend/__init__.py | 35 | 4 |
| backend/config.py | 628 | 62 |
| backend/council.py | 10528 | 1182 |
| backend/main.py | 6836 | 545 |
| backend/openrouter.py | 2183 | 225 |
| backend/storage.py | 4430 | 395 |
| frontend/.gitignore | 253 | 27 |
| frontend/README.md | 1157 | 113 |
| frontend/eslint.config.js | 758 | 66 |
| frontend/index.html | 357 | 28 |
| frontend/package-lock.json | 136497 | 6682 |
| frontend/package.json | 637 | 54 |
| frontend/public/vite.svg | 1497 | 90 |
| frontend/src/App.css | 320 | 36 |
| frontend/src/App.jsx | 6044 | 515 |
| frontend/src/api.js | 2860 | 308 |
| frontend/src/assets/react.svg | 4126 | 366 |
| frontend/src/components/ChatInterface.css | 2607 | 298 |
| frontend/src/components/ChatInterface.jsx | 4457 | 321 |
| frontend/src/components/Sidebar.css | 1196 | 136 |
| frontend/src/components/Sidebar.jsx | 1215 | 87 |
| frontend/src/components/Stage1.css | 964 | 120 |
| frontend/src/components/Stage1.jsx | 1008 | 83 |
| frontend/src/components/Stage2.css | 2240 | 278 |
| frontend/src/components/Stage2.jsx | 3341 | 260 |
| frontend/src/components/Stage3.css | 370 | 42 |
| frontend/src/components/Stage3.jsx | 621 | 48 |
| frontend/src/index.css | 1649 | 190 |
| frontend/src/main.jsx | 229 | 24 |
| frontend/vite.config.js | 161 | 18 |
| main.py | 89 | 10 |
| pyproject.toml | 278 | 27 |
| start.sh | 625 | 91 |
| uv.lock | 141673 | 6773 |

### llm.c

Files: 102, words: 154834

| file | bytes | words |
|---|---|---|
| .github/workflows/ci.yml | 9440 | 755 |
| .github/workflows/ci_gpu.yml | 3638 | 419 |
| .github/workflows/ci_tests.yml | 3360 | 282 |
| .gitignore | 518 | 46 |
| LICENSE | 1072 | 169 |
| Makefile | 10890 | 1335 |
| README.md | 16471 | 2278 |
| dev/cpu/matmul_forward.c | 7164 | 980 |
| dev/cuda/Makefile | 3328 | 328 |
| dev/cuda/README.md | 2347 | 377 |
| dev/cuda/adamw.cu | 9720 | 975 |
| dev/cuda/attention_backward.cu | 49193 | 6860 |
| dev/cuda/attention_forward.cu | 54669 | 7489 |
| dev/cuda/benchmark_on_modal.py | 5745 | 554 |
| dev/cuda/classifier_fused.cu | 35115 | 4666 |
| dev/cuda/common.h | 13921 | 1557 |
| dev/cuda/crossentropy_forward.cu | 5045 | 589 |
| dev/cuda/crossentropy_softmax_backward.cu | 6030 | 718 |
| dev/cuda/encoder_backward.cu | 6655 | 852 |
| dev/cuda/encoder_forward.cu | 8567 | 1151 |
| dev/cuda/fused_residual_forward.cu | 28022 | 3631 |
| dev/cuda/gelu_backward.cu | 6824 | 865 |
| dev/cuda/gelu_forward.cu | 5623 | 721 |
| dev/cuda/global_norm.cu | 10901 | 1392 |
| dev/cuda/layernorm_backward.cu | 71946 | 8938 |
| dev/cuda/layernorm_forward.cu | 24118 | 3289 |
| dev/cuda/matmul_backward.cu | 10934 | 1323 |
| dev/cuda/matmul_backward_bias.cu | 27255 | 3623 |
| dev/cuda/matmul_forward.cu | 18230 | 2151 |
| dev/cuda/nccl_all_reduce.cu | 7604 | 749 |
| dev/cuda/permute.cu | 6673 | 1032 |
| dev/cuda/residual_forward.cu | 5418 | 638 |
| dev/cuda/softmax_forward.cu | 25050 | 3669 |
| dev/cuda/trimat_forward.cu | 27483 | 4459 |
| dev/data/README.md | 741 | 120 |
| dev/data/data_common.py | 4908 | 576 |
| dev/data/edu_fineweb.sh | 2008 | 236 |
| dev/data/fineweb.py | 6286 | 636 |
| dev/data/fineweb.sh | 1992 | 238 |
| dev/data/hellaswag.py | 7646 | 861 |
| dev/data/mmlu.py | 5816 | 600 |
| dev/data/tinyshakespeare.py | 4068 | 398 |
| dev/data/tinystories.py | 4925 | 445 |
| dev/download_starter_pack.sh | 2046 | 217 |
| dev/eval/README.md | 2557 | 333 |
| dev/eval/export_hf.py | 7304 | 690 |
| dev/eval/run_eval.sh | 4899 | 312 |
| dev/eval/summarize_eval.py | 1074 | 102 |
| dev/loss_checker_ci.py | 2999 | 290 |
| dev/test/Makefile | 5737 | 747 |
| dev/test/device_file_io.cu | 1946 | 168 |
| dev/test/test_dataloader.c | 11929 | 1521 |
| dev/test/test_outlier_detector.c | 1726 | 210 |
| dev/unistd.h | 4995 | 585 |
| dev/vislog.ipynb | 5702 | 620 |
| doc/layernorm/layernorm.c | 6204 | 917 |
| doc/layernorm/layernorm.md | 18425 | 2914 |
| doc/layernorm/layernorm.py | 1996 | 303 |
| llmc/adamw.cuh | 5477 | 569 |
| llmc/attention.cuh | 11324 | 1895 |
| llmc/cublas_common.h | 1306 | 131 |
| llmc/cuda_common.h | 8388 | 903 |
| llmc/cuda_utils.cuh | 11247 | 1307 |
| llmc/cudnn_att.cpp | 12945 | 1254 |
| llmc/cudnn_att.h | 799 | 90 |
| llmc/dataloader.h | 24450 | 2905 |
| llmc/encoder.cuh | 11302 | 1541 |
| llmc/fused_classifier.cuh | 6800 | 905 |
| llmc/gelu.cuh | 2662 | 332 |
| llmc/global_norm.cuh | 3715 | 467 |
| llmc/layernorm.cuh | 22720 | 2917 |
| llmc/logger.h | 1865 | 215 |
| llmc/matmul.cuh | 14117 | 1450 |
| llmc/mfu.h | 10321 | 1204 |
| llmc/outlier_detector.h | 2498 | 319 |
| llmc/rand.h | 7453 | 927 |
| llmc/sampler.h | 1146 | 175 |
| llmc/schedulers.h | 4340 | 449 |
| llmc/tokenizer.h | 3691 | 457 |
| llmc/utils.h | 8662 | 1023 |
| llmc/zero.cuh | 23059 | 2293 |
| profile_gpt2.cu | 2948 | 408 |
| profile_gpt2cu.py | 8682 | 1021 |
| requirements.txt | 59 | 7 |
| scripts/README.md | 2745 | 453 |
| scripts/multi_node/run_gpt2_124M_fs.sbatch | 3170 | 375 |
| scripts/multi_node/run_gpt2_124M_mpi.sh | 1579 | 210 |
| scripts/multi_node/run_gpt2_124M_tcp.sbatch | 3195 | 379 |
| scripts/pyrun_gpt2_124M.sh | 876 | 103 |
| scripts/run_gpt2_124M.sh | 1289 | 176 |
| scripts/run_gpt2_1558M.sh | 1306 | 176 |
| scripts/run_gpt2_350M.sh | 1352 | 184 |
| scripts/run_gpt2_774M.sh | 1372 | 188 |
| scripts/run_gpt3_125M.sh | 1323 | 175 |
| test_gpt2.c | 8030 | 854 |
| test_gpt2.cu | 17190 | 1968 |
| test_gpt2_fp32.cu | 11089 | 1117 |
| train_gpt2.c | 50680 | 7297 |
| train_gpt2.cu | 104649 | 12396 |
| train_gpt2.py | 41860 | 4516 |
| train_gpt2_fp32.cu | 77134 | 10475 |
| train_llama3.py | 57539 | 5729 |

### makemore

Files: 4, words: 35960

| file | bytes | words |
|---|---|---|
| LICENSE | 1072 | 169 |
| README.md | 3033 | 448 |
| makemore.py | 29659 | 3310 |
| names.txt | 228145 | 32033 |

### micrograd

Files: 11, words: 3953

| file | bytes | words |
|---|---|---|
| .gitignore | 20 | 1 |
| LICENSE | 1081 | 171 |
| README.md | 3009 | 476 |
| demo.ipynb | 57550 | 1306 |
| gout.svg | 11360 | 818 |
| micrograd/__init__.py | 0 | 0 |
| micrograd/engine.py | 2730 | 317 |
| micrograd/nn.py | 1613 | 183 |
| setup.py | 717 | 56 |
| test/test_engine.py | 1470 | 304 |
| trace_graph.ipynb | 2934 | 321 |

### minGPT

Files: 17, words: 9588

| file | bytes | words |
|---|---|---|
| .gitignore | 54 | 5 |
| LICENSE | 1081 | 171 |
| README.md | 9869 | 1545 |
| demo.ipynb | 11266 | 1318 |
| generate.ipynb | 6366 | 624 |
| mingpt/__init__.py | 0 | 0 |
| mingpt/bpe.py | 15888 | 1922 |
| mingpt/model.py | 14686 | 1549 |
| mingpt/trainer.py | 3466 | 318 |
| mingpt/utils.py | 3596 | 412 |
| projects/adder/adder.py | 8287 | 1011 |
| projects/adder/readme.md | 53 | 10 |
| projects/chargpt/chargpt.py | 4079 | 396 |
| projects/chargpt/readme.md | 687 | 84 |
| projects/readme.md | 92 | 14 |
| setup.py | 267 | 19 |
| tests/test_huggingface_import.py | 2057 | 190 |

### minbpe

Files: 15, words: 35125

| file | bytes | words |
|---|---|---|
| .gitignore | 65 | 6 |
| LICENSE | 1063 | 168 |
| README.md | 9283 | 1316 |
| exercise.md | 3605 | 517 |
| lecture.md | 8507 | 1347 |
| minbpe/__init__.py | 128 | 16 |
| minbpe/base.py | 6881 | 808 |
| minbpe/basic.py | 2883 | 367 |
| minbpe/gpt4.py | 5810 | 658 |
| minbpe/regex.py | 7344 | 840 |
| requirements.txt | 14 | 2 |
| tests/__init__.py | 0 | 0 |
| tests/taylorswift.txt | 185768 | 28241 |
| tests/test_tokenizer.py | 6213 | 723 |
| train.py | 882 | 116 |

### nanoGPT

Files: 24, words: 13485

| file | bytes | words |
|---|---|---|
| .gitattributes | 214 | 20 |
| .gitignore | 100 | 12 |
| LICENSE | 1072 | 169 |
| README.md | 13850 | 2120 |
| bench.py | 4815 | 487 |
| config/eval_gpt2.py | 208 | 35 |
| config/eval_gpt2_large.py | 215 | 35 |
| config/eval_gpt2_medium.py | 216 | 35 |
| config/eval_gpt2_xl.py | 213 | 35 |
| config/finetune_shakespeare.py | 645 | 103 |
| config/train_gpt2.py | 681 | 117 |
| config/train_shakespeare_char.py | 1132 | 196 |
| configurator.py | 1758 | 219 |
| data/openwebtext/prepare.py | 3167 | 377 |
| data/openwebtext/readme.md | 489 | 47 |
| data/shakespeare/prepare.py | 1132 | 101 |
| data/shakespeare/readme.md | 161 | 25 |
| data/shakespeare_char/prepare.py | 2344 | 286 |
| data/shakespeare_char/readme.md | 209 | 29 |
| model.py | 16345 | 1774 |
| sample.py | 3942 | 468 |
| scaling_laws.ipynb | 268519 | 3295 |
| train.py | 14857 | 1803 |
| transformer_sizing.ipynb | 14579 | 1697 |

### nanochat

Files: 51, words: 87591

| file | bytes | words |
|---|---|---|
| .claude/skills/read-arxiv-paper/SKILL.md | 1973 | 317 |
| .gitignore | 109 | 14 |
| .python-version | 5 | 1 |
| LICENSE | 1072 | 169 |
| README.md | 16570 | 2411 |
| dev/LEADERBOARD.md | 12993 | 1941 |
| dev/LOG.md | 63385 | 9232 |
| dev/estimate_gpt3_core.ipynb | 73112 | 6955 |
| dev/repackage_data_reference.py | 4580 | 516 |
| dev/scaling_analysis.ipynb | 15187 | 1481 |
| nanochat/__init__.py | 0 | 0 |
| nanochat/checkpoint_manager.py | 8722 | 845 |
| nanochat/common.py | 13560 | 1326 |
| nanochat/core_eval.py | 11572 | 1259 |
| nanochat/dataloader.py | 7450 | 827 |
| nanochat/dataset.py | 7014 | 743 |
| nanochat/engine.py | 15533 | 1539 |
| nanochat/execution.py | 5313 | 586 |
| nanochat/flash_attention.py | 7146 | 832 |
| nanochat/fp8.py | 12008 | 1485 |
| nanochat/gpt.py | 28918 | 3189 |
| nanochat/loss_eval.py | 3124 | 406 |
| nanochat/optim.py | 23314 | 2549 |
| nanochat/tokenizer.py | 12911 | 1235 |
| pyproject.toml | 1310 | 150 |
| runs/miniseries.sh | 4000 | 401 |
| runs/runcpu.sh | 2055 | 310 |
| runs/scaling_laws.sh | 5364 | 549 |
| runs/speedrun.sh | 3758 | 517 |
| scripts/base_eval.py | 10311 | 875 |
| scripts/base_train.py | 32313 | 3483 |
| scripts/chat_cli.py | 3918 | 380 |
| scripts/chat_eval.py | 11557 | 1135 |
| scripts/chat_rl.py | 16879 | 1734 |
| scripts/chat_sft.py | 24733 | 2554 |
| scripts/infer_bench.py | 12736 | 1331 |
| scripts/tok_eval.py | 11127 | 1270 |
| scripts/tok_train.py | 3730 | 384 |
| tasks/arc.py | 2159 | 235 |
| tasks/common.py | 8738 | 974 |
| tasks/gsm8k.py | 4861 | 526 |
| tasks/humaneval.py | 3537 | 381 |
| tasks/mmlu.py | 3552 | 312 |
| tasks/smoltalk.py | 2065 | 212 |
| tests/test_attention_fallback.py | 16095 | 1497 |
| tests/test_engine.py | 9241 | 1029 |
| tests/test_execution.py | 2513 | 249 |
| tests/test_optim.py | 4968 | 516 |
| tests/test_tasks.py | 3103 | 404 |
| tests/test_tokenizer.py | 5487 | 573 |
| uv.lock | 473535 | 25752 |

### neuraltalk

Files: 40, words: 19492

| file | bytes | words |
|---|---|---|
| .gitignore | 13 | 2 |
| Readme.md | 7758 | 1177 |
| cv/Readme.md | 39 | 6 |
| data/README.md | 92 | 14 |
| driver.py | 16687 | 1956 |
| eval/multi-bleu.perl | 4968 | 557 |
| eval_sentence_predictions.py | 4813 | 554 |
| example_images/Readme.md | 1728 | 284 |
| example_images/result.html | 1643 | 210 |
| example_images/result_struct.json | 3037 | 326 |
| example_images/tasks.txt | 170 | 16 |
| imagernn/Readme.md | 841 | 129 |
| imagernn/__init__.py | 0 | 0 |
| imagernn/data_provider.py | 4225 | 501 |
| imagernn/generic_batch_generator.py | 5701 | 719 |
| imagernn/imagernn_utils.py | 1718 | 218 |
| imagernn/lstm_generator.py | 11016 | 1525 |
| imagernn/rnn_generator.py | 9572 | 1319 |
| imagernn/solver.py | 5220 | 639 |
| imagernn/utils.py | 804 | 123 |
| matlab_features_reference/README.md | 756 | 119 |
| matlab_features_reference/deploy_features.prototxt | 4462 | 585 |
| matlab_features_reference/extract_features.m | 1250 | 149 |
| matlab_features_reference/prepare_images_batch.m | 635 | 103 |
| monitorcv.html | 4280 | 452 |
| predict_on_images.py | 4029 | 500 |
| py_caffe_feat_extract.py | 9826 | 1063 |
| python_features/README.md | 614 | 85 |
| python_features/deploy_features.prototxt | 4462 | 585 |
| python_features/extract_features.py | 3347 | 346 |
| requirements.txt | 21 | 3 |
| status/Readme.md | 57 | 8 |
| vis_resources/d3.min.js | 146658 | 2806 |
| vis_resources/d3utils.css | 277 | 42 |
| vis_resources/d3utils.js | 1494 | 175 |
| vis_resources/jquery-1.8.3.min.js | 93636 | 1245 |
| vis_resources/jsutils.js | 809 | 117 |
| vis_resources/underscore-min.js | 14682 | 361 |
| vis_resources/underscore-min.map | 25382 | 3 |
| visualize_result_struct.html | 5025 | 470 |

### neuraltalk2

Files: 28, words: 17217

| file | bytes | words |
|---|---|---|
| .gitignore | 95 | 8 |
| README.md | 12220 | 1763 |
| coco-caption/myeval.py | 1154 | 143 |
| coco/coco_preprocess.ipynb | 5216 | 575 |
| convert_checkpoint_gpu_to_cpu.lua | 3682 | 409 |
| cv/README.md | 2548 | 443 |
| cv/driver.py | 1692 | 182 |
| cv/inspect_cv.ipynb | 181144 | 953 |
| cv/killall.sh | 69 | 16 |
| cv/runworker.sh | 258 | 16 |
| cv/spawn.sh | 196 | 36 |
| eval.lua | 8293 | 935 |
| misc/DataLoader.lua | 5423 | 647 |
| misc/DataLoaderRaw.lua | 3037 | 379 |
| misc/LSTM.lua | 2187 | 248 |
| misc/LanguageModel.lua | 17843 | 2256 |
| misc/call_python_caption_eval.sh | 56 | 8 |
| misc/gradcheck.lua | 2521 | 373 |
| misc/net_utils.lua | 6776 | 868 |
| misc/optim_updates.lua | 2281 | 275 |
| misc/utils.lua | 1673 | 272 |
| prepro.py | 9491 | 1230 |
| test_language_model.lua | 10583 | 1157 |
| train.lua | 18411 | 2004 |
| videocaptioning.lua | 5505 | 572 |
| vis/imgs/dummy | 0 | 0 |
| vis/index.html | 2017 | 204 |
| vis/jquery-1.8.3.min.js | 93636 | 1245 |

### ng-video-lecture

Files: 5, words: 206099

| file | bytes | words |
|---|---|---|
| README.md | 1154 | 189 |
| bigram.py | 4140 | 523 |
| gpt.py | 8140 | 943 |
| input.txt | 1115394 | 202651 |
| more.txt | 10001 | 1793 |

### nipspreview

Files: 15, words: 6178

| file | bytes | words |
|---|---|---|
| Readme.md | 1848 | 266 |
| abstracts/dummy.txt | 0 | 0 |
| generatenice.py | 1873 | 244 |
| generatenicelda.py | 4421 | 666 |
| getabstracts.py | 1719 | 286 |
| jquery-1.8.3.min.js | 93636 | 1245 |
| lda.py | 5993 | 606 |
| makecorpus.py | 1384 | 224 |
| nipsnice_template.html | 7125 | 929 |
| pdftothumbs.py | 1045 | 170 |
| pdftowordcloud.py | 1632 | 267 |
| scrape.py | 2126 | 305 |
| stopwords.txt | 4180 | 668 |
| thumbs/dummy.txt | 0 | 0 |
| vocabulary.py | 6612 | 302 |

### nn

Files: 175, words: 72140

| file | bytes | words |
|---|---|---|
| .luacheckrc | 149 | 21 |
| .travis.yml | 1063 | 118 |
| Abs.lua | 342 | 26 |
| AbsCriterion.lua | 410 | 29 |
| Add.lua | 1699 | 139 |
| AddConstant.lua | 984 | 83 |
| BCECriterion.lua | 1584 | 116 |
| BatchNormalization.lua | 5792 | 530 |
| CAddTable.lua | 580 | 41 |
| CDivTable.lua | 667 | 38 |
| CMakeLists.txt | 1833 | 167 |
| CMul.lua | 3574 | 275 |
| CMulTable.lua | 1083 | 73 |
| CONTRIBUTING.md | 4983 | 727 |
| COPYRIGHT.txt | 2049 | 289 |
| CSubTable.lua | 618 | 38 |
| ClassNLLCriterion.lua | 2966 | 260 |
| Concat.lua | 3881 | 399 |
| ConcatTable.lua | 3268 | 353 |
| Container.lua | 1717 | 148 |
| Copy.lua | 1142 | 89 |
| CosineDistance.lua | 1079 | 84 |
| CosineEmbeddingCriterion.lua | 1328 | 121 |
| Criterion.lua | 1247 | 112 |
| CriterionTable.lua | 504 | 31 |
| CrossEntropyCriterion.lua | 951 | 70 |
| DepthConcat.lua | 4471 | 430 |
| DistKLDivCriterion.lua | 454 | 29 |
| DotProduct.lua | 652 | 49 |
| Dropout.lua | 1119 | 111 |
| ErrorMessages.lua | 322 | 41 |
| Euclidean.lua | 5685 | 489 |
| Exp.lua | 224 | 17 |
| FlattenTable.lua | 3118 | 421 |
| HardShrink.lua | 422 | 31 |
| HardTanh.lua | 281 | 19 |
| HingeEmbeddingCriterion.lua | 666 | 66 |
| Identity.lua | 263 | 23 |
| Jacobian.lua | 8186 | 660 |
| JoinTable.lua | 1830 | 153 |
| L1Cost.lua | 307 | 19 |
| L1HingeEmbeddingCriterion.lua | 1160 | 101 |
| L1Penalty.lua | 1129 | 113 |
| L2Normalize.lua | 1597 | 144 |
| Linear.lua | 3191 | 268 |
| Log.lua | 458 | 28 |
| LogSigmoid.lua | 390 | 27 |
| LogSoftMax.lua | 293 | 19 |
| LookupTable.lua | 4662 | 447 |
| MM.lua | 2695 | 326 |
| MSECriterion.lua | 410 | 29 |
| MarginCriterion.lua | 484 | 35 |
| MarginRankingCriterion.lua | 1963 | 133 |
| Max.lua | 411 | 35 |
| Mean.lua | 959 | 72 |
| Min.lua | 411 | 35 |
| MixtureTable.lua | 5277 | 386 |
| Module.lua | 8166 | 732 |
| Mul.lua | 860 | 68 |
| MulConstant.lua | 1071 | 85 |
| MultiCriterion.lua | 1095 | 81 |
| MultiLabelMarginCriterion.lua | 501 | 29 |
| MultiMarginCriterion.lua | 609 | 58 |
| Narrow.lua | 713 | 43 |
| PReLU.lua | 825 | 68 |
| Padding.lua | 1441 | 137 |
| PairwiseDistance.lua | 2674 | 199 |
| Parallel.lua | 3780 | 338 |
| ParallelCriterion.lua | 1687 | 123 |
| ParallelTable.lua | 1694 | 213 |
| Power.lua | 549 | 36 |
| README.md | 2638 | 202 |
| ReLU.lua | 118 | 10 |
| Replicate.lua | 1470 | 160 |
| Reshape.lua | 1801 | 158 |
| Select.lua | 562 | 35 |
| SelectTable.lua | 1016 | 94 |
| Sequential.lua | 3488 | 326 |
| Sigmoid.lua | 275 | 19 |
| SoftMax.lua | 278 | 20 |
| SoftMin.lua | 557 | 36 |
| SoftPlus.lua | 762 | 87 |
| SoftShrink.lua | 422 | 31 |
| SoftSign.lua | 561 | 30 |
| SparseJacobian.lua | 8618 | 696 |
| SparseLinear.lua | 1740 | 130 |
| SpatialAdaptiveMaxPooling.lua | 799 | 45 |
| SpatialAveragePooling.lua | 906 | 84 |
| SpatialBatchNormalization.lua | 7239 | 662 |
| SpatialContrastiveNormalization.lua | 1444 | 118 |
| SpatialConvolution.lua | 3794 | 334 |
| SpatialConvolutionMM.lua | 2450 | 201 |
| SpatialConvolutionMap.lua | 4530 | 446 |
| SpatialDivisiveNormalization.lua | 4659 | 326 |
| SpatialDropout.lua | 1350 | 132 |
| SpatialFullConvolution.lua | 1589 | 127 |
| SpatialFullConvolutionMap.lua | 1990 | 143 |
| SpatialLPPooling.lua | 959 | 101 |
| SpatialMaxPooling.lua | 816 | 63 |
| SpatialSubSampling.lua | 1412 | 115 |
| SpatialSubtractiveNormalization.lua | 3302 | 258 |
| SpatialUpSamplingNearest.lua | 1974 | 198 |
| SpatialZeroPadding.lua | 5655 | 708 |
| SplitTable.lua | 1055 | 89 |
| Sqrt.lua | 362 | 30 |
| Square.lua | 333 | 23 |
| StochasticGradient.lua | 1921 | 173 |
| Sum.lua | 858 | 81 |
| Tanh.lua | 257 | 19 |
| TanhShrink.lua | 555 | 35 |
| TemporalConvolution.lua | 1670 | 125 |
| TemporalMaxPooling.lua | 767 | 50 |
| TemporalSubSampling.lua | 1378 | 102 |
| Threshold.lua | 1158 | 118 |
| Transpose.lua | 754 | 66 |
| View.lua | 2232 | 261 |
| VolumetricConvolution.lua | 1702 | 148 |
| VolumetricMaxPooling.lua | 897 | 76 |
| WeightedEuclidean.lua | 8147 | 644 |
| WeightedMSECriterion.lua | 894 | 62 |
| doc/containers.md | 8376 | 1020 |
| doc/convolution.md | 23216 | 3364 |
| doc/criterion.md | 19343 | 2545 |
| doc/module.md | 13613 | 1701 |
| doc/overview.md | 7364 | 901 |
| doc/simple.md | 28249 | 3898 |
| doc/table.md | 25610 | 3370 |
| doc/testing.md | 328 | 42 |
| doc/training.md | 7387 | 973 |
| doc/transfer.md | 7837 | 868 |
| generic/Abs.c | 1254 | 117 |
| generic/AbsCriterion.c | 1607 | 146 |
| generic/DistKLDivCriterion.c | 1699 | 153 |
| generic/HardShrink.c | 1629 | 151 |
| generic/HardTanh.c | 2572 | 251 |
| generic/L1Cost.c | 1248 | 111 |
| generic/LogSigmoid.c | 1602 | 138 |
| generic/LogSoftMax.c | 3059 | 335 |
| generic/MSECriterion.c | 1619 | 145 |
| generic/MarginCriterion.c | 1809 | 167 |
| generic/Max.c | 3336 | 277 |
| generic/Min.c | 3336 | 277 |
| generic/MultiLabelMarginCriterion.c | 5032 | 513 |
| generic/MultiMarginCriterion.c | 4233 | 447 |
| generic/PReLU.c | 6215 | 711 |
| generic/Sigmoid.c | 1293 | 118 |
| generic/SoftMax.c | 2705 | 312 |
| generic/SoftPlus.c | 1931 | 196 |
| generic/SoftShrink.c | 1647 | 155 |
| generic/SparseLinear.c | 10175 | 1037 |
| generic/SpatialAdaptiveMaxPooling.c | 9345 | 830 |
| generic/SpatialAveragePooling.c | 5276 | 591 |
| generic/SpatialConvolution.c | 6312 | 652 |
| generic/SpatialConvolutionMM.c | 14346 | 1308 |
| generic/SpatialConvolutionMap.c | 8866 | 905 |
| generic/SpatialFullConvolution.c | 6405 | 666 |
| generic/SpatialFullConvolutionMap.c | 7941 | 771 |
| generic/SpatialMaxPooling.c | 8769 | 834 |
| generic/SpatialSubSampling.c | 8340 | 924 |
| generic/SpatialUpSamplingNearest.c | 4430 | 551 |
| generic/Sqrt.c | 2401 | 228 |
| generic/Square.c | 2114 | 196 |
| generic/Tanh.c | 2159 | 206 |
| generic/TemporalConvolution.c | 12641 | 953 |
| generic/TemporalMaxPooling.c | 6611 | 760 |
| generic/TemporalSubSampling.c | 4443 | 379 |
| generic/Threshold.c | 2224 | 198 |
| generic/VolumetricConvolution.c | 6928 | 707 |
| generic/VolumetricMaxPooling.c | 9680 | 1087 |
| hessian.lua | 17742 | 1031 |
| init.c | 5800 | 268 |
| init.lua | 3350 | 121 |
| rocks/nn-scm-1.rockspec | 561 | 74 |
| test.lua | 139533 | 13876 |
| utils.lua | 471 | 45 |

### nn-zero-to-hero

Files: 9, words: 25966

| file | bytes | words |
|---|---|---|
| LICENSE | 1072 | 169 |
| README.md | 6828 | 917 |
| lectures/makemore/makemore_part1_bigrams.ipynb | 389057 | 6056 |
| lectures/makemore/makemore_part2_mlp.ipynb | 47747 | 1441 |
| lectures/makemore/makemore_part3_bn.ipynb | 495080 | 3408 |
| lectures/makemore/makemore_part4_backprop.ipynb | 37502 | 3500 |
| lectures/makemore/makemore_part5_cnn1.ipynb | 35882 | 1986 |
| lectures/micrograd/micrograd_lecture_first_half_roughly.ipynb | 81042 | 4055 |
| lectures/micrograd/micrograd_lecture_second_half_roughly.ipynb | 76357 | 4434 |

### notpygamejs

Files: 8, words: 2814

| file | bytes | words |
|---|---|---|
| Readme.md | 1481 | 229 |
| demos/ballbounce.html | 1151 | 125 |
| demos/evolve.html | 12925 | 1296 |
| demos/exgame.html | 4221 | 429 |
| demos/particles.html | 1309 | 138 |
| include/npgmain.js | 3287 | 410 |
| include/vector2D.js | 835 | 116 |
| starter.html | 684 | 71 |

### optim

Files: 40, words: 10812

| file | bytes | words |
|---|---|---|
| .dokx | 85 | 10 |
| CMakeLists.txt | 511 | 39 |
| COPYRIGHT.txt | 1953 | 279 |
| ConfusionMatrix.lua | 11216 | 1102 |
| Logger.lua | 4854 | 515 |
| README.md | 1101 | 165 |
| adadelta.lua | 1973 | 216 |
| adagrad.lua | 1621 | 207 |
| adam.lua | 2161 | 281 |
| asgd.lua | 2061 | 294 |
| cg.lua | 5676 | 750 |
| checkgrad.lua | 1099 | 174 |
| dok/index.dok | 2300 | 312 |
| fista.lua | 6084 | 799 |
| init.lua | 691 | 47 |
| lbfgs.lua | 8469 | 1035 |
| lswolfe.lua | 5987 | 710 |
| nag.lua | 2692 | 351 |
| optim-1.0.3-0.rockspec | 674 | 88 |
| optim-1.0.3-1.rockspec | 674 | 88 |
| optim-1.0.4-0.rockspec | 657 | 85 |
| optim-1.0.5-0.rockspec | 638 | 82 |
| polyinterp.lua | 6321 | 788 |
| rmsprop.lua | 1669 | 220 |
| rprop.lua | 3301 | 364 |
| sgd.lua | 2862 | 356 |
| test/l2.lua | 555 | 84 |
| test/rosenbrock.lua | 1390 | 143 |
| test/sparsecoding.lua | 3907 | 473 |
| test/test_adadelta.lua | 382 | 45 |
| test/test_adagrad.lua | 373 | 42 |
| test/test_adam.lua | 362 | 42 |
| test/test_cg.lua | 367 | 32 |
| test/test_confusion.lua | 1003 | 106 |
| test/test_fista.lua | 2188 | 221 |
| test/test_lbfgs.lua | 708 | 76 |
| test/test_lbfgs_w_ls.lua | 379 | 39 |
| test/test_logger.lua | 504 | 68 |
| test/test_rmsprop.lua | 373 | 42 |
| test/test_sgd.lua | 369 | 42 |

### paper-notes

Files: 5, words: 4853

| file | bytes | words |
|---|---|---|
| .gitignore | 11 | 1 |
| Readme.md | 65 | 12 |
| matching_networks.md | 11081 | 1760 |
| vin.md | 9642 | 1530 |
| wikireading.md | 10073 | 1550 |

### pytorch-made

Files: 3, words: 1518

| file | bytes | words |
|---|---|---|
| README.md | 2911 | 453 |
| made.py | 5973 | 670 |
| run.py | 3983 | 395 |

### pytorch-normalizing-flows

Files: 7, words: 5052

| file | bytes | words |
|---|---|---|
| Readme.md | 593 | 76 |
| nflib/__init__.py | 0 | 0 |
| nflib/flows.py | 10318 | 1231 |
| nflib/made.py | 4200 | 477 |
| nflib/nets.py | 2287 | 241 |
| nflib/spline_flows.py | 10940 | 1200 |
| nflib1.ipynb | 815336 | 1827 |

### randomfun

Files: 18, words: 42740

| file | bytes | words |
|---|---|---|
| MicroGrad.ipynb | 1023 | 95 |
| MixtureDensityNets.ipynb | 295720 | 2808 |
| README.md | 72 | 12 |
| es.ipynb | 94291 | 443 |
| floats.ipynb | 34912 | 2539 |
| irust/hello-rust/Cargo.toml | 199 | 23 |
| irust/hello-rust/src/main.rs | 6397 | 835 |
| irust/readme.md | 923 | 127 |
| knn_vs_svm.ipynb | 5802 | 716 |
| lectures/makemore/makemore_part1_bigrams.ipynb | 389057 | 6056 |
| lectures/micrograd/micrograd_lecture_first_half_roughly.ipynb | 81042 | 4055 |
| lectures/micrograd/micrograd_lecture_second_half_roughly.ipynb | 76357 | 4434 |
| min-char-rnn-nb.ipynb | 18906 | 2167 |
| min-char-rnn-nb2.ipynb | 24154 | 2761 |
| min-char-rnn-nb3.ipynb | 26470 | 3047 |
| nand_to_uint.ipynb | 187088 | 11079 |
| sexual_reproduction.ipynb | 25661 | 903 |
| transformer_unify.ipynb | 5143 | 640 |

### reader3

Files: 9, words: 8101

| file | bytes | words |
|---|---|---|
| .gitignore | 134 | 17 |
| .python-version | 5 | 1 |
| README.md | 1421 | 215 |
| pyproject.toml | 275 | 29 |
| reader3.py | 10113 | 964 |
| server.py | 3812 | 350 |
| templates/library.html | 1831 | 186 |
| templates/reader.html | 7090 | 772 |
| uv.lock | 114455 | 5567 |

### recurrentjs

Files: 7, words: 23603

| file | bytes | words |
|---|---|---|
| Readme.md | 4590 | 770 |
| character_demo.html | 107846 | 18412 |
| external/jquery-1.8.3.min.js | 93636 | 1245 |
| external/jquery-ui.min.css | 18195 | 350 |
| external/jquery-ui.min.js | 100680 | 543 |
| src/recurrent.js | 15861 | 1990 |
| src/vis.js | 2420 | 293 |

### reinforcejs

Files: 22, words: 33790

| file | bytes | words |
|---|---|---|
| README.md | 1936 | 261 |
| agentzoo/puckagent.json | 36359 | 1 |
| agentzoo/wateragent.json | 446607 | 1 |
| external/d3.min.js | 150762 | 2892 |
| external/highlight.pack.js | 10183 | 289 |
| external/highlight_default.css | 2642 | 239 |
| external/jquery-1.11.2.min.js | 95931 | 1412 |
| external/jquery-2.1.3.min.js | 84319 | 1304 |
| external/jquery-ui.min.css | 18195 | 350 |
| external/jquery-ui.min.js | 100680 | 543 |
| external/jquery.flot.min.js | 52966 | 490 |
| external/marked.js | 28191 | 3150 |
| external/mathjax.js | 60573 | 934 |
| external/underscore-min.js | 16523 | 388 |
| gridworld_dp.html | 26862 | 3381 |
| gridworld_td.html | 34259 | 4341 |
| index.html | 6873 | 712 |
| lib/rl.js | 48146 | 6184 |
| loop.svg | 1293 | 52 |
| puckworld.html | 30181 | 3779 |
| waterworld.html | 16148 | 1497 |
| waterworld.js | 12343 | 1590 |

### rendergit

Files: 4, words: 2284

| file | bytes | words |
|---|---|---|
| README.md | 2066 | 316 |
| pyproject.toml | 885 | 108 |
| rendergit.py | 17366 | 1706 |
| uv.lock | 1740 | 154 |

### researchlei

Files: 11, words: 9034

| file | bytes | words |
|---|---|---|
| Readme.md | 3957 | 597 |
| addpaper.py | 7013 | 938 |
| client/authors.html | 4854 | 481 |
| client/d3.v3.min.js | 137385 | 2545 |
| client/index.html | 14959 | 1553 |
| client/jquery-1.8.3.min.js | 93636 | 1245 |
| client/style.css | 3310 | 423 |
| copyresources.py | 1035 | 140 |
| genjson.py | 1826 | 221 |
| stopwords.txt | 4180 | 668 |
| topwords.py | 1471 | 223 |

### researchpooler

Files: 10, words: 3016

| file | bytes | words |
|---|---|---|
| README | 7540 | 1067 |
| demo1.py | 1477 | 203 |
| demo2.py | 1071 | 143 |
| demo3.py | 2095 | 271 |
| google_search.py | 922 | 115 |
| nips_add_pdftext.py | 1864 | 217 |
| nips_download_parse.py | 4474 | 446 |
| pdf_read.py | 1096 | 126 |
| repool_analysis.py | 1305 | 154 |
| repool_util.py | 2111 | 274 |

### rustbpe

Files: 11, words: 9999

| file | bytes | words |
|---|---|---|
| .github/workflows/ci.yml | 1459 | 155 |
| .github/workflows/release.yml | 2611 | 221 |
| .gitignore | 286 | 42 |
| .python-version | 5 | 1 |
| Cargo.lock | 21574 | 1624 |
| Cargo.toml | 1088 | 166 |
| LICENSE | 1071 | 169 |
| README.md | 5223 | 670 |
| pyproject.toml | 1187 | 159 |
| src/lib.rs | 36233 | 3724 |
| tests/python/test_tokenizer.py | 29739 | 3068 |

### scholaroctopus

Files: 6, words: 197456

| file | bytes | words |
|---|---|---|
| README.md | 906 | 132 |
| render/d3.min.js | 146658 | 2806 |
| render/data5.json | 2303455 | 189570 |
| render/icon.svg | 29397 | 2402 |
| render/index.html | 12169 | 1301 |
| render/jquery-1.8.3.min.js | 93636 | 1245 |

### scriptsbots

Files: 29, words: 24248

| file | bytes | words |
|---|---|---|
| .gitignore | 41 | 6 |
| Agent.cpp | 6126 | 527 |
| Agent.h | 2372 | 304 |
| AssemblyBrain.cpp | 2743 | 293 |
| AssemblyBrain.h | 529 | 51 |
| CMakeLists.txt | 1132 | 74 |
| DWRAONBrain.cpp | 5502 | 483 |
| DWRAONBrain.h | 1035 | 124 |
| GLView.cpp | 15092 | 1124 |
| GLView.h | 1249 | 144 |
| MLPBrain.cpp | 5398 | 464 |
| MLPBrain.h | 986 | 116 |
| README | 789 | 109 |
| README.txt | 1387 | 186 |
| View.cpp | 19 | 2 |
| View.h | 234 | 36 |
| World.cpp | 21417 | 1887 |
| World.h | 1476 | 161 |
| changes.txt | 2257 | 382 |
| config.h.in | 51 | 4 |
| glut.h | 21440 | 2305 |
| helpers.h | 1085 | 123 |
| main.cpp | 1281 | 113 |
| oldmain.cpp | 31242 | 2599 |
| report.txt | 1756 | 584 |
| scriptbots.vcproj | 4165 | 213 |
| settings.h | 2128 | 311 |
| vmath.cpp | 2152 | 312 |
| vmath.h | 73700 | 11211 |

### simple-amt

Files: 27, words: 4088

| file | bytes | words |
|---|---|---|
| .gitignore | 88 | 7 |
| LICENSE.txt | 1081 | 171 |
| README.md | 11737 | 1845 |
| approve_assignments.py | 1532 | 158 |
| config.json.example | 172 | 13 |
| disable_hits.py | 918 | 95 |
| examples/image_sentence/.gitignore | 24 | 2 |
| examples/image_sentence/approve_assignments.sh | 81 | 3 |
| examples/image_sentence/disable_hits.sh | 74 | 3 |
| examples/image_sentence/example_input.txt | 431 | 2 |
| examples/image_sentence/get_results.sh | 119 | 7 |
| examples/image_sentence/launch_hits.sh | 242 | 10 |
| examples/image_sentence/show_progress.sh | 79 | 3 |
| examples/simple/.gitignore | 24 | 2 |
| get_results.py | 1213 | 108 |
| hit_properties/image_sentence.json | 332 | 34 |
| hit_properties/simple.json | 304 | 41 |
| hit_templates/image_sentence.html | 5273 | 457 |
| hit_templates/simple.html | 2851 | 318 |
| hit_templates/simpleamt.html | 1629 | 132 |
| launch_hits.py | 1876 | 175 |
| reject_assignments.py | 970 | 100 |
| render_template.py | 580 | 42 |
| requirements.txt | 59 | 4 |
| show_account_balance.py | 318 | 24 |
| show_hit_progress.py | 983 | 106 |
| simpleamt.py | 2767 | 226 |

### svmjs

Files: 13, words: 7594

| file | bytes | words |
|---|---|---|
| MIT-LICENSE | 1059 | 167 |
| README.md | 4008 | 659 |
| demo/demosvm.html | 8164 | 877 |
| demo/jqueryui/css/ui-lightness/jquery-ui-1.8.21.custom.css | 20092 | 1848 |
| demo/jqueryui/js/jquery-1.7.2.min.js | 94840 | 1236 |
| demo/jqueryui/js/jquery-ui-1.8.21.custom.min.js | 24241 | 295 |
| demo/npg_include/npgmain.js | 3300 | 411 |
| demo/npg_include/vector2D.js | 835 | 116 |
| lib/svm.js | 12268 | 1463 |
| package.json | 344 | 31 |
| test/testnode.js | 717 | 69 |
| test/testsvm.html | 2446 | 276 |
| test/testsvm.m | 1023 | 146 |

### tf-agent

Files: 2, words: 629

| file | bytes | words |
|---|---|---|
| README.md | 55 | 10 |
| policy_gradient.py | 6333 | 619 |

### tsnejs

Files: 2, words: 1998

| file | bytes | words |
|---|---|---|
| Readme.md | 2496 | 354 |
| tsne.js | 11292 | 1644 |

### twoolpy

Files: 8, words: 1883

| file | bytes | words |
|---|---|---|
| README.md | 1476 | 226 |
| authtest.py | 236 | 28 |
| followersdiff.py | 1729 | 265 |
| printactive.py | 764 | 114 |
| recommend.py | 3680 | 504 |
| tweetutils.py | 634 | 70 |
| twitstream.py | 7229 | 616 |
| userstream.py | 592 | 60 |

### ulogme

Files: 121, words: 85075

| file | bytes | words |
|---|---|---|
| .gitignore | 68 | 8 |
| README.md | 6995 | 1108 |
| export_events.py | 3165 | 441 |
| keyfreq.sh | 708 | 105 |
| legacy_split_events.py | 3013 | 481 |
| logactivewin.sh | 2494 | 341 |
| logdesktop.sh | 615 | 81 |
| note.sh | 370 | 64 |
| osx/.gitignore | 7 | 1 |
| osx/build_app.sh | 35 | 6 |
| osx/dist/ulogme_osx.app/Contents/Frameworks/Python.framework/Versions/2.7/Resources/Info.plist | 873 | 42 |
| osx/dist/ulogme_osx.app/Contents/Frameworks/Python.framework/Versions/2.7/include/python2.7/pyconfig.h | 36733 | 6179 |
| osx/dist/ulogme_osx.app/Contents/Frameworks/Python.framework/Versions/2.7/lib/python2.7/config/Makefile | 49702 | 4921 |
| osx/dist/ulogme_osx.app/Contents/Info.plist | 2453 | 120 |
| osx/dist/ulogme_osx.app/Contents/PkgInfo | 8 | 1 |
| osx/dist/ulogme_osx.app/Contents/Resources/__boot__.py | 10443 | 868 |
| osx/dist/ulogme_osx.app/Contents/Resources/__error__.sh | 559 | 89 |
| osx/dist/ulogme_osx.app/Contents/Resources/include/python2.7/pyconfig.h | 36733 | 6179 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/config/Makefile | 49702 | 4921 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/config/Setup | 18484 | 2783 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/config/Setup.config | 368 | 59 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/config/Setup.local | 41 | 8 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/__init__.py | 2856 | 294 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/_parseaddr.py | 15733 | 1692 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/base64mime.py | 5794 | 798 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/charset.py | 16043 | 1808 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/encoders.py | 2015 | 217 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/errors.py | 1628 | 169 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/feedparser.py | 20606 | 2062 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/generator.py | 14228 | 1661 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/header.py | 22243 | 2748 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/iterators.py | 2202 | 257 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/message.py | 30720 | 3534 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/__init__.py | 2 | 1 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/application.py | 1256 | 126 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/audio.py | 2683 | 323 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/base.py | 794 | 83 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/image.py | 1764 | 202 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/message.py | 1286 | 152 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/multipart.py | 1573 | 180 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/nonmultipart.py | 689 | 80 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/text.py | 1006 | 104 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/parser.py | 3300 | 379 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/quoprimime.py | 10848 | 1464 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/__init__.py | 2 | 1 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_01.txt | 459 | 56 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_02.txt | 2811 | 308 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_03.txt | 366 | 49 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_04.txt | 961 | 104 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_05.txt | 558 | 38 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_06.txt | 1037 | 103 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_07.txt | 5227 | 108 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_08.txt | 452 | 39 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_09.txt | 430 | 38 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_10.txt | 882 | 71 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_11.txt | 142 | 19 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_12.txt | 642 | 52 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_12a.txt | 644 | 52 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_13.txt | 5367 | 120 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_14.txt | 641 | 88 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_15.txt | 1396 | 107 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_16.txt | 5203 | 438 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_17.txt | 330 | 40 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_18.txt | 230 | 13 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_19.txt | 757 | 102 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_20.txt | 507 | 62 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_21.txt | 376 | 34 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_22.txt | 1894 | 80 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_23.txt | 139 | 12 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_24.txt | 157 | 14 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_25.txt | 5122 | 469 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_26.txt | 2099 | 131 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_27.txt | 578 | 51 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_28.txt | 380 | 36 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_29.txt | 583 | 60 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_30.txt | 322 | 32 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_31.txt | 200 | 18 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_32.txt | 418 | 40 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_33.txt | 750 | 56 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_34.txt | 300 | 38 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_35.txt | 136 | 17 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_36.txt | 816 | 53 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_37.txt | 209 | 20 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_38.txt | 2548 | 232 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_39.txt | 1955 | 131 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_40.txt | 197 | 12 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_41.txt | 185 | 22 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_42.txt | 313 | 29 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_43.txt | 9166 | 933 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_44.txt | 895 | 100 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_45.txt | 965 | 102 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/msg_46.txt | 816 | 81 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/test_email.py | 130364 | 9677 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/test_email_codecs.py | 2842 | 246 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/test_email_codecs_renamed.py | 2842 | 246 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/test_email_renamed.py | 121318 | 8934 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/test_email_torture.py | 3669 | 307 |
| osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/utils.py | 9863 | 1173 |
| osx/dist/ulogme_osx.app/Contents/Resources/ulogme_osx.py | 6490 | 542 |
| osx/osx_setup.sh | 301 | 44 |
| osx/rewind7am.py | 912 | 129 |
| osx/run_ulogme_osx.sh | 1519 | 191 |
| osx/setup.py | 129 | 10 |
| osx/ulogme_osx.py | 6490 | 542 |
| render/.gitignore | 36 | 2 |
| render/d3.min.js | 146658 | 2806 |
| render/d3utils.js | 3704 | 443 |
| render/font_lato.css | 655 | 45 |
| render/index.html | 19444 | 1867 |
| render/index_style.css | 3532 | 448 |
| render/jquery-1.8.3.min.js | 93636 | 1245 |
| render/overview.html | 16195 | 1701 |
| render/overview_style.css | 1328 | 173 |
| render/render_settings_example.js | 3161 | 482 |
| render/render_utils.js | 1248 | 179 |
| render/spin.min.js | 4143 | 79 |
| render/ulogme_common.js | 6629 | 862 |
| render/underscore.min.js | 14682 | 361 |
| rewind7am.py | 912 | 129 |
| ulogme.sh | 178 | 27 |
| ulogme_serve.py | 2184 | 234 |

## Failed / skipped

### Clone failures

None.

### Repos not fetched

- Forks: lifejs, examples, sqlitedict, cpython, transformers (see Fork decisions).
- Any gists/repos not visible via the methods above.

### skipped (binary/large)

| unit | path | bytes | reason |
|---|---|---|---|
| LLM101n | llm101n.jpg | 282186 | skipped (binary/large): binary by extension |
| Random-Forest-Matlab | data/lenna.jpg | 20401 | skipped (binary/large): binary by extension |
| arxiv-sanity-lite | screenshot.jpg | 497891 | skipped (binary/large): binary by extension |
| arxiv-sanity-lite | static/favicon.png | 6408 | skipped (binary/large): binary by extension |
| arxiv-sanity-lite | static/search.png | 1422 | skipped (binary/large): binary by extension |
| arxiv-sanity-preserver | static/favicon.png | 4668 | skipped (binary/large): binary by extension |
| arxiv-sanity-preserver | static/linkto.png | 1956 | skipped (binary/large): binary by extension |
| arxiv-sanity-preserver | static/missing.jpg | 8492 | skipped (binary/large): binary by extension |
| arxiv-sanity-preserver | static/save.png | 1029 | skipped (binary/large): binary by extension |
| arxiv-sanity-preserver | static/saved.png | 652 | skipped (binary/large): binary by extension |
| arxiv-sanity-preserver | static/search.png | 1422 | skipped (binary/large): binary by extension |
| arxiv-sanity-preserver | ui.jpeg | 259138 | skipped (binary/large): binary by extension |
| autoresearch | progress.png | 252961 | skipped (binary/large): binary by extension |
| calorie | screenshot.png | 92655 | skipped (binary/large): binary by extension |
| convnetjs | compile/yuicompressor-2.4.8.jar | 787524 | skipped (binary/large): binary by extension |
| convnetjs | test/jasmine/lib/jasmine-2.0.0/jasmine_favicon.png | 2057 | skipped (binary/large): binary by extension |
| covid-sanity | static/favicon.png | 10792 | skipped (binary/large): binary by extension |
| covid-sanity | static/search.png | 1422 | skipped (binary/large): binary by extension |
| covid-sanity | ui.png | 259626 | skipped (binary/large): binary by extension |
| find-birds | ui.png | 200305 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-bg_diagonals-thick_18_b81900_40x40.png | 260 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-bg_diagonals-thick_20_666666_40x40.png | 251 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-bg_flat_10_000000_40x100.png | 178 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-bg_glass_100_f6f6f6_1x400.png | 104 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-bg_glass_100_fdf5ce_1x400.png | 125 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-bg_glass_65_ffffff_1x400.png | 105 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-bg_gloss-wave_35_f6a828_500x100.png | 4427 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-bg_highlight-soft_100_eeeeee_1x100.png | 90 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-bg_highlight-soft_75_ffe45c_1x100.png | 129 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-icons_222222_256x240.png | 4369 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-icons_228ef1_256x240.png | 4369 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-icons_ef8c08_256x240.png | 4369 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-icons_ffd27a_256x240.png | 5355 | skipped (binary/large): binary by extension |
| forestjs | demo/jqueryui/css/ui-lightness/images/ui-icons_ffffff_256x240.png | 4369 | skipped (binary/large): binary by extension |
| hn-time-capsule | hnhero.png | 545021 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ai/.DS_Store | 6148 | skipped (binary/large): binary (NUL bytes) |
| karpathy.github.io | assets/ai/digibrain.jpg | 186555 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ai/eye2.jpg | 40211 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ai/graph.png | 281739 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ai/hand.jpg | 179527 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ai/lifetree.gif | 100540 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ai/neocortex.png | 76251 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ai/ocean.jpeg | 71460 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ai/psych.jpg | 300612 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/atp_recycling.png | 334984 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/body_composition.png | 114609 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/combustion.jpeg | 86213 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/combustion2.png | 137089 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/cookie.jpg | 210603 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/dexa.png | 78966 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/energy_metabolism_1.png | 347337 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/expected_loss.png | 35163 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/subway_map.png | 292255 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/sweating.jpg | 105686 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/weight.png | 56128 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/bio/weight_loss.gif | 23722 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/banana.jpeg | 33245 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/break1.jpeg | 87993 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/break2.jpeg | 63545 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/breakconv.png | 107219 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/fish.jpeg | 85286 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/fool1.jpeg | 105213 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/fool2.jpeg | 104407 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/noise1.jpeg | 63921 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/noise2.jpeg | 64649 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/rapeseed.jpeg | 121682 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/rapeseed2.jpeg | 93141 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/szegedy.jpeg | 125526 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/break/templates.jpeg | 93267 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/chrome1.jpeg | 15499 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/chrome2.jpeg | 45290 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/chrome3.jpeg | 5419 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/chrome4.jpeg | 68394 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/cifar_predict.jpg | 152974 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/cifar_preview.png | 340619 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/cifar_weirdimages.png | 50033 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/cnntsne.jpeg | 155930 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/hn.jpg | 136504 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ilsvrc1.png | 413553 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ilsvrc2.png | 226609 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ilsvrc3.png | 349667 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/lecun/errors32.png | 25086 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/lecun/lecun1989.png | 195409 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/megoogle.jpg | 18792 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/microgpt.jpg | 1686666 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/nips2012.jpeg | 26169 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/obamafunny.jpg | 249084 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/objectdiscovery.jpeg | 39455 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/phd/adviser.gif | 71140 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/phd/arxiv-papers.png | 2425835 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/phd/code.jpg | 142273 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/phd/latex.png | 114802 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/phd/phds.jpg | 415165 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/phd/posters.jpg | 722881 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/phd/talk.jpg | 89092 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/discounted.png | 26255 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/episodes.png | 45069 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/frostbite.jpg | 31040 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/mdp.png | 34603 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/montezuma.png | 2289 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/nondiff1.png | 48695 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/nondiff2.png | 76786 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/pg.png | 167224 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/policy.png | 54059 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/pong.gif | 16291 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/preview.jpeg | 54860 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/rl.png | 79987 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/sl.png | 76459 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rl/weights.png | 207318 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/charseq.jpeg | 84774 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/diags.jpeg | 68679 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/diags_old.jpeg | 86311 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/house_generate.gif | 626173 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/house_read.gif | 839099 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/latex1.jpeg | 161316 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/latex2.jpeg | 46243 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/latex3.jpeg | 231685 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/latex4.jpeg | 313757 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/pane1.png | 633413 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/pane2.png | 384662 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/under1.jpeg | 515889 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/under2.jpeg | 530360 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/under3.jpeg | 261944 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/rnn/under4.jpeg | 114932 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/celebs_grid_render.jpg | 1944422 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/cnnvis.jpg | 117496 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/crop2.jpg | 70897 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/crops1.jpg | 128002 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/gif2.gif | 2122948 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/grid_render_all.jpg | 867353 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/grid_render_best.jpg | 332905 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/grid_render_continuum.jpg | 903642 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/grid_render_posneg.jpg | 242144 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/grid_render_tsne_reduced.jpg | 346544 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/grid_render_worst.jpg | 202042 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/males.jpg | 183840 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/selfiebot2.png | 122985 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/teaser.jpeg | 399109 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/selfie/useful.jpg | 274786 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/sportspredict.jpeg | 156994 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/tsne_eg.jpeg | 52376 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/tsne_preview.jpeg | 93579 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/tsne_sentprepro.jpeg | 165449 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ulogme_mv1.jpeg | 214673 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ulogme_mv2.jpeg | 88972 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ulogme_mv3.jpeg | 136787 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ulogme_sv1.jpeg | 31973 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ulogme_sv2.jpeg | 62918 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ulogme_sv3.jpeg | 87522 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ulogme_sv4.jpeg | 38871 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/ulogmeoverview.jpeg | 151121 | skipped (binary/large): binary by extension |
| karpathy.github.io | assets/zeilercnnfeatures.jpeg | 106362 | skipped (binary/large): binary by extension |
| lecun1989-repro | lecun1989.png | 195409 | skipped (binary/large): binary by extension |
| llama2.c | assets/llama_cute.jpg | 187553 | skipped (binary/large): binary by extension |
| llama2.c | tokenizer.bin | 433869 | skipped (binary/large): binary by extension |
| llama2.c | tokenizer.model | 499723 | skipped (binary/large): binary (NUL bytes) |
| llm-council | header.jpg | 162963 | skipped (binary/large): binary by extension |
| micrograd | moon_mlp.png | 15806 | skipped (binary/large): binary by extension |
| micrograd | puppy.jpg | 49269 | skipped (binary/large): binary by extension |
| minGPT | mingpt.jpg | 118276 | skipped (binary/large): binary by extension |
| minbpe | assets/tiktokenizer.png | 254538 | skipped (binary/large): binary by extension |
| nanoGPT | assets/gpt2_124M_loss.png | 110433 | skipped (binary/large): binary by extension |
| nanoGPT | assets/nanogpt.jpg | 118621 | skipped (binary/large): binary by extension |
| nanochat | dev/nanochat.png | 1305 | skipped (binary/large): binary by extension |
| nanochat | dev/scaling_laws_jan26.png | 93061 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/7EGRMwN.jpg | 281335 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/89pUfSc.jpg | 162122 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/QmG3nS6.jpg | 1529222 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/UbVIl1e.jpg | 72919 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/animals.jpg | 127581 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/cat.jpg | 132441 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/cobra.jpg | 90383 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/diving.jpg | 591412 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/dogdinner.jpg | 126629 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/frog.jpg | 90355 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/gWEHGwf.jpg | 245278 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/hole.jpg | 57550 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/japanese.jpg | 124027 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/jump.jpg | 81922 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/koala.jpg | 105335 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/mic.jpg | 93199 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/pope.jpg | 87399 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/pose.jpg | 232745 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/qjujW6d.png | 567608 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/seal.jpg | 42311 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/vgg_feats.mat | 94399 | skipped (binary/large): binary by extension |
| neuraltalk | example_images/work.jpg | 230247 | skipped (binary/large): binary by extension |
| neuraltalk2 | vis/teaser.jpeg | 40873 | skipped (binary/large): binary by extension |
| nn | doc/image/abs.png | 5918 | skipped (binary/large): binary by extension |
| nn | doc/image/exp.png | 6104 | skipped (binary/large): binary by extension |
| nn | doc/image/hshrink.png | 5576 | skipped (binary/large): binary by extension |
| nn | doc/image/htanh.png | 5948 | skipped (binary/large): binary by extension |
| nn | doc/image/lena.jpg | 39706 | skipped (binary/large): binary by extension |
| nn | doc/image/lenap.jpg | 34838 | skipped (binary/large): binary by extension |
| nn | doc/image/logsigmoid.png | 9116 | skipped (binary/large): binary by extension |
| nn | doc/image/logsoftmax.png | 8712 | skipped (binary/large): binary by extension |
| nn | doc/image/power.png | 6515 | skipped (binary/large): binary by extension |
| nn | doc/image/prelu.png | 19812 | skipped (binary/large): binary by extension |
| nn | doc/image/relu.png | 19636 | skipped (binary/large): binary by extension |
| nn | doc/image/sigmmoid.png | 6533 | skipped (binary/large): binary by extension |
| nn | doc/image/sigmoid.png | 6533 | skipped (binary/large): binary by extension |
| nn | doc/image/softmax.png | 6252 | skipped (binary/large): binary by extension |
| nn | doc/image/softmin.png | 6446 | skipped (binary/large): binary by extension |
| nn | doc/image/softplus.png | 9375 | skipped (binary/large): binary by extension |
| nn | doc/image/softsign.png | 6877 | skipped (binary/large): binary by extension |
| nn | doc/image/sqrt.png | 6008 | skipped (binary/large): binary by extension |
| nn | doc/image/square.png | 6984 | skipped (binary/large): binary by extension |
| nn | doc/image/sshrink.png | 5576 | skipped (binary/large): binary by extension |
| nn | doc/image/tanh.png | 7323 | skipped (binary/large): binary by extension |
| paper-notes | img/matching_networks/Screen Shot 2016-08-07 at 10.08.44 PM.png | 305266 | skipped (binary/large): binary by extension |
| paper-notes | img/matching_networks/Screen Shot 2016-08-07 at 11.14.26 PM.png | 21024 | skipped (binary/large): binary by extension |
| paper-notes | img/matching_networks/Screen Shot 2016-08-07 at 11.20.29 PM.png | 37851 | skipped (binary/large): binary by extension |
| paper-notes | img/matching_networks/Screen Shot 2016-08-07 at 11.57.10 PM.png | 181349 | skipped (binary/large): binary by extension |
| paper-notes | img/matching_networks/Screen Shot 2016-08-08 at 10.21.45 AM.png | 231111 | skipped (binary/large): binary by extension |
| paper-notes | img/matching_networks/Screen Shot 2016-08-08 at 10.27.46 AM.png | 181685 | skipped (binary/large): binary by extension |
| paper-notes | img/matching_networks/Screen Shot 2016-08-08 at 12.11.15 AM.png | 71608 | skipped (binary/large): binary by extension |
| paper-notes | img/vin/Screen Shot 2016-08-13 at 3.26.04 PM.png | 23355 | skipped (binary/large): binary by extension |
| paper-notes | img/vin/Screen Shot 2016-08-13 at 4.43.04 PM.png | 55113 | skipped (binary/large): binary by extension |
| paper-notes | img/vin/Screen Shot 2016-08-13 at 4.58.42 PM.png | 178341 | skipped (binary/large): binary by extension |
| paper-notes | img/vin/Screen Shot 2016-08-13 at 5.47.23 PM.png | 81847 | skipped (binary/large): binary by extension |
| paper-notes | img/wikireading/Screen Shot 2016-08-07 at 1.53.11 PM.png | 226079 | skipped (binary/large): binary by extension |
| paper-notes | img/wikireading/Screen Shot 2016-08-07 at 2.37.48 PM.png | 34765 | skipped (binary/large): binary by extension |
| paper-notes | img/wikireading/Screen Shot 2016-08-07 at 2.38.24 PM.png | 42272 | skipped (binary/large): binary by extension |
| paper-notes | img/wikireading/Screen Shot 2016-08-07 at 3.18.05 PM.png | 60893 | skipped (binary/large): binary by extension |
| paper-notes | img/wikireading/Screen Shot 2016-08-07 at 4.07.18 PM.png | 428245 | skipped (binary/large): binary by extension |
| paper-notes | img/wikireading/Screen Shot 2016-08-07 at 4.22.13 PM.png | 178891 | skipped (binary/large): binary by extension |
| pytorch-made | made.png | 79759 | skipped (binary/large): binary by extension |
| pytorch-normalizing-flows | assets/moon_flow.png | 110381 | skipped (binary/large): binary by extension |
| randomfun | puppy.jpg | 30452 | skipped (binary/large): binary by extension |
| randomfun | rnnlm.jpeg | 84774 | skipped (binary/large): binary by extension |
| reader3 | reader3.png | 238611 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-bg_diagonals-thick_18_b81900_40x40.png | 418 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-bg_diagonals-thick_20_666666_40x40.png | 312 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-bg_flat_10_000000_40x100.png | 205 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-bg_glass_100_f6f6f6_1x400.png | 262 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-bg_glass_100_fdf5ce_1x400.png | 348 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-bg_glass_65_ffffff_1x400.png | 207 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-bg_gloss-wave_35_f6a828_500x100.png | 5815 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-bg_highlight-soft_100_eeeeee_1x100.png | 278 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-bg_highlight-soft_75_ffe45c_1x100.png | 328 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-icons_222222_256x240.png | 6922 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-icons_228ef1_256x240.png | 4549 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-icons_ef8c08_256x240.png | 4549 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-icons_ffd27a_256x240.png | 4549 | skipped (binary/large): binary by extension |
| recurrentjs | external/images/ui-icons_ffffff_256x240.png | 6299 | skipped (binary/large): binary by extension |
| reinforcejs | external/.DS_Store | 6148 | skipped (binary/large): binary (NUL bytes) |
| reinforcejs | external/images/ui-bg_diagonals-thick_18_b81900_40x40.png | 418 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-bg_diagonals-thick_20_666666_40x40.png | 312 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-bg_flat_10_000000_40x100.png | 205 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-bg_glass_100_f6f6f6_1x400.png | 262 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-bg_glass_100_fdf5ce_1x400.png | 348 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-bg_glass_65_ffffff_1x400.png | 207 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-bg_gloss-wave_35_f6a828_500x100.png | 5815 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-bg_highlight-soft_100_eeeeee_1x100.png | 278 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-bg_highlight-soft_75_ffe45c_1x100.png | 328 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-icons_222222_256x240.png | 6922 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-icons_228ef1_256x240.png | 4549 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-icons_ef8c08_256x240.png | 4549 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-icons_ffd27a_256x240.png | 4549 | skipped (binary/large): binary by extension |
| reinforcejs | external/images/ui-icons_ffffff_256x240.png | 6299 | skipped (binary/large): binary by extension |
| reinforcejs | img/dpsolved.jpeg | 49769 | skipped (binary/large): binary by extension |
| reinforcejs | img/lambda.png | 11661 | skipped (binary/large): binary by extension |
| reinforcejs | img/policyiter.png | 8654 | skipped (binary/large): binary by extension |
| reinforcejs | img/qsa.jpeg | 44553 | skipped (binary/large): binary by extension |
| reinforcejs | img/sarsa.png | 4543 | skipped (binary/large): binary by extension |
| reinforcejs | img/traces.png | 8979 | skipped (binary/large): binary by extension |
| researchlei | client/arrowdown.png | 3383 | skipped (binary/large): binary by extension |
| researchlei | client/arrowup.png | 2843 | skipped (binary/large): binary by extension |
| researchlei | client/back.png | 2399 | skipped (binary/large): binary by extension |
| researchlei | client/bulb.png | 1317 | skipped (binary/large): binary by extension |
| researchlei | client/graph.png | 4767 | skipped (binary/large): binary by extension |
| scriptsbots | glut.dll | 169984 | skipped (binary/large): binary by extension |
| scriptsbots | glut.lib | 79654 | skipped (binary/large): binary (NUL bytes) |
| scriptsbots | glut32.dll | 169984 | skipped (binary/large): binary by extension |
| scriptsbots | glut32.lib | 79898 | skipped (binary/large): binary (NUL bytes) |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-bg_diagonals-thick_18_b81900_40x40.png | 260 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-bg_diagonals-thick_20_666666_40x40.png | 251 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-bg_flat_10_000000_40x100.png | 178 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-bg_glass_100_f6f6f6_1x400.png | 104 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-bg_glass_100_fdf5ce_1x400.png | 125 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-bg_glass_65_ffffff_1x400.png | 105 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-bg_gloss-wave_35_f6a828_500x100.png | 4427 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-bg_highlight-soft_100_eeeeee_1x100.png | 90 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-bg_highlight-soft_75_ffe45c_1x100.png | 129 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-icons_222222_256x240.png | 4369 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-icons_228ef1_256x240.png | 4369 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-icons_ef8c08_256x240.png | 4369 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-icons_ffd27a_256x240.png | 5355 | skipped (binary/large): binary by extension |
| svmjs | demo/jqueryui/css/ui-lightness/images/ui-icons_ffffff_256x240.png | 4369 | skipped (binary/large): binary by extension |
| svmjs | test/smo.pdf | 79701 | skipped (binary/large): binary by extension |
| tsnejs | .DS_Store | 6148 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Frameworks/Python.framework/Versions/2.7/Python | 2564496 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/MacOS/python | 58288 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/MacOS/ulogme_osx | 71316 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/PythonApplet.icns | 63136 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/__init__.pyo | 3172 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/_parseaddr.pyo | 15175 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/base64mime.pyo | 5573 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/charset.pyo | 14343 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/encoders.pyo | 2582 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/errors.pyo | 4279 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/feedparser.pyo | 12201 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/generator.pyo | 11335 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/header.pyo | 14392 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/iterators.pyo | 2616 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/message.pyo | 30973 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/__init__.pyo | 180 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/application.pyo | 1734 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/audio.pyo | 3109 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/base.pyo | 1266 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/image.pyo | 2199 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/message.pyo | 1598 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/multipart.pyo | 1819 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/nonmultipart.pyo | 1036 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/mime/text.pyo | 1458 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/parser.pyo | 4229 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/quoprimime.pyo | 9500 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/__init__.pyo | 180 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/PyBanner048.gif | 954 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/data/audiotest.au | 24544 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/test_email.pyo | 158505 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/test_email_codecs.pyo | 3182 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/test_email_codecs_renamed.pyo | 3230 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/test_email_renamed.pyo | 149934 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/test/test_email_torture.pyo | 4967 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/email/utils.pyo | 9963 | skipped (binary/large): binary (NUL bytes) |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/AppKit/_AppKit.so | 71248 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/AppKit/_inlines.so | 38624 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/CoreFoundation/_CoreFoundation.so | 110704 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/CoreFoundation/_inlines.so | 46576 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/Foundation/_Foundation.so | 110256 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/Foundation/_inlines.so | 54496 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/MacOS.so | 50800 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/Nav.so | 26416 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/Quartz/CoreGraphics/_callbacks.so | 75424 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/Quartz/CoreGraphics/_coregraphics.so | 53296 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/Quartz/CoreGraphics/_doubleindirect.so | 40080 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/Quartz/CoreGraphics/_inlines.so | 38544 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/Quartz/CoreGraphics/_sortandmap.so | 44368 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/Quartz/CoreVideo/_CVPixelBuffer.so | 40176 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_AE.so | 69056 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_Ctl.so | 113024 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_Dlg.so | 53296 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_Evt.so | 40944 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_File.so | 92592 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_Menu.so | 74656 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_Qd.so | 34368 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_Res.so | 65968 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_Win.so | 51376 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_bisect.so | 35024 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_codecs_cn.so | 277440 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_codecs_hk.so | 306400 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_codecs_iso2022.so | 51760 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_codecs_jp.so | 482992 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_codecs_kr.so | 265056 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_codecs_tw.so | 219904 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_collections.so | 63264 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_ctypes.so | 196704 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_functools.so | 40176 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_hashlib.so | 49056 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_heapq.so | 51872 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_io.so | 241216 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_locale.so | 44768 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_multibytecodec.so | 70928 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_random.so | 44560 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_scproxy.so | 40976 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_socket.so | 140608 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_ssl.so | 75328 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_struct.so | 76016 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/_testcapi.so | 94960 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/array.so | 84768 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/audioop.so | 60544 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/binascii.so | 52144 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/bz2.so | 75920 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/cPickle.so | 137840 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/cStringIO.so | 48928 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/datetime.so | 144096 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/fcntl.so | 43952 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/gestalt.so | 34768 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/grp.so | 35424 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/itertools.so | 99968 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/math.so | 70592 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/objc/_objc.so | 696640 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/operator.so | 72624 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/parser.so | 99280 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/pyexpat.so | 96064 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/resource.so | 43952 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/select.so | 61920 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/strop.so | 73536 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/termios.so | 48496 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/time.so | 57872 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/unicodedata.so | 1395808 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/lib-dynload/zlib.so | 61232 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/site-packages.zip | 2529204 | skipped (binary/large): binary by extension |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/lib/python2.7/site.pyc | 0 | skipped (binary/large): symlink removed |
| ulogme | osx/dist/ulogme_osx.app/Contents/Resources/site.pyc | 3343 | skipped (binary/large): binary by extension |
