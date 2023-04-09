%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% hochgi blog post
% LaTeX Class
% Version 0.1 (09/04/2023)
%
% Reusable constructs for all blog posts
% 
% Authors:
% hochgi
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{hochgiblogpost}[03/01/2022]

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{extarticle}} % Pass through any options to the base class
\ProcessOptions\relax % Process given options

\LoadClass{extarticle} % Load the base class

%----------------------------------------------------------------------------------------
%	PACKAGES AND OTHER DOCUMENT CONFIGURATIONS
%----------------------------------------------------------------------------------------

\setlength{\parindent}{0mm} % Suppress paragraph indentation
\usepackage[hidelinks]{hyperref} % Required for links but hide the default boxes around links
\pagestyle{empty} % No headers or footers
\usepackage{moresize} % Provides more font size commands (\HUGE and \ssmall)
\usepackage{fontawesome} % fontawesome
\usepackage{ifthen}

%----------------------------------------------------------------------------------------
%	COLORS
%----------------------------------------------------------------------------------------

\usepackage[dvipsnames]{xcolor}

\definecolor{lightGrey}{HTML}{BAB5B0}       % 
\definecolor{LighterGrey}{HTML}{C0C0C0}     % basicstyle
\definecolor{LightestGrey}{HTML}{EFEFEF}    % 
\definecolor{BackgroundGrey}{HTML}{303030}  % backgroundcolor
\definecolor{Greyish}{HTML}{506266}         % 
\definecolor{BookmarkGreyish}{HTML}{8F867D} % 
\definecolor{CommentGreyish}{HTML}{75715E}  % commentstyle
\definecolor{RedTintGreyish}{HTML}{837A71}  % 

\definecolor{Orange}{HTML}{FF8000}          % procnamestyle
\definecolor{DarkOrange}{HTML}{A05000}      % 
\definecolor{LightOrange}{HTML}{FFA020}     % 
\definecolor{LighterOrange}{HTML}{FFB01C}   % stringstyle
\definecolor{LightestOrange}{HTML}{FFC880}  % 
\definecolor{YellowClass}{HTML}{E6DB74}     % class type

\definecolor{Cyan}{HTML}{40C0E0}            % keywordstyle
\definecolor{Teal}{HTML}{00A0A0}            % 
\definecolor{Blue1}{HTML}{0086B3}           % 
\definecolor{Blue2}{HTML}{0083BF}           % 
\definecolor{Blue3}{HTML}{0E82C7}           % 
\definecolor{Blue4}{HTML}{005AC3}           % 


% Colors for links, text and headings
\usepackage{hyperref}

\hypersetup{colorlinks,breaklinks, urlcolor=Cyan, linkcolor=Cyan} % Set up links and colors

%----------------------------------------------------------------------------------------
%	CODE BLOCKS
%----------------------------------------------------------------------------------------

\usepackage[export]{adjustbox}
\usepackage[procnames]{listings}
\renewcommand{\ttdefault}{pcr}

\lstset{basicstyle=\color{LighterGrey}\ttfamily\small,
        keywordstyle=\color{Cyan}\ttfamily\bfseries,
        commentstyle=\color{CommentGreyish}\ttfamily,
        stringstyle=\color{LighterOrange},
        framesep=0.5pt,
        framerule=0pt,
        procnamekeys={def,val,var},
        procnamestyle=\color{Orange}\ttfamily,
        emphstyle = [1]{\color{YellowClass}\ttfamily\bfseries},
        % frame=trbl, % draw a frame around the code block
        % rulecolor=\color{lightgray}, % frame color
        backgroundcolor=\color{BackgroundGrey}, % background color
        % frameround=tttt % rounded corners
        % fillcolor=\color{Sandbox7},
        % backgroundcolor=\color{Gareyish},
        % rulecolor=\color{MidGrey},
        showstringspaces=false,
        frame=single,
        % rulesepcolor=\color{red},
        % frameshape={RYRR}{nny}{ynn}{RYRR},
        breaklines=false,
        texcl=true,
        escapeinside={//}{\^^M}}

%----------------------------------------------------------------------------------------
%	DIMENSIONS
%----------------------------------------------------------------------------------------

\newlength\margin
\setlength\margin{0.15cm}
\usepackage[margin=\margin,noheadfoot,a4paper, paperheight=1000pt]{geometry}

% \newlength\mainwidth
% \setlength\mainwidth{\paperwidth-2\margin}

%----------------------------------------------------------------------------------------
%	MAIN
%----------------------------------------------------------------------------------------

\usepackage{ragged2e}
\usepackage[absolute,overlay]{textpos} % option needed to use absolute positionning and to have text on front
\usepackage{wrapfig}
\usepackage[utf8]{inputenc} % Required for inputting international characters
\usepackage[T1]{fontenc} % Output font encoding for international characters

% \usepackage{roboto}
\usepackage[scaled]{helvet}